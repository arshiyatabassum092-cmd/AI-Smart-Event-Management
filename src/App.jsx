import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ChatWidget } from './components/ai/ChatWidget';
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailPage } from './pages/EventDetailPage';
import { MyRegistrationsPage } from './pages/MyRegistrationsPage';
import { DashboardPage } from './pages/DashboardPage';
import { EventParticipantsPage } from './pages/EventParticipantsPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { eventService } from './services/eventService';
import { isFirebaseConfigured } from './services/firebase';
import { geminiService } from './services/geminiService';
import { useAuth } from './context/AuthContext';
import { useNotification } from './context/NotificationContext';
import { Sparkles, Info, X } from 'lucide-react';

export function App() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfigNotice, setShowConfigNotice] = useState(false);
  const { isOrganiser } = useAuth();
  const { notifySuccess, notifyInfo } = useNotification();

  const loadEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getEvents();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // Show configuration hint once if either Firebase or Gemini is not set up with real keys
    if (!isFirebaseConfigured || !geminiService.isConfigured()) {
      setShowConfigNotice(true);
    }
  }, []);

  // Reload events whenever active role switches between Student and Organiser
  useEffect(() => {
    loadEvents();
  }, [isOrganiser]);

  // Listen for registration updates across the application and keep events synchronized
  useEffect(() => {
    const handleRegistrationChange = () => {
      loadEvents();
    };
    window.addEventListener('smart_events_registration_changed', handleRegistrationChange);
    window.addEventListener('storage', handleRegistrationChange);
    return () => {
      window.removeEventListener('smart_events_registration_changed', handleRegistrationChange);
      window.removeEventListener('storage', handleRegistrationChange);
    };
  }, []);

  const handleEventCreated = async (newEvent) => {
    const created = await eventService.createEvent(newEvent);
    await loadEvents();
    return created;
  };

  const handleEventUpdated = async (id, updatedFields) => {
    const updated = await eventService.updateEvent(id, updatedFields);
    await loadEvents();
    return updated;
  };

  const handleEventDeleted = async (id) => {
    await eventService.deleteEvent(id);
    await loadEvents();
  };

  const handleSeedDemo = async () => {
    await eventService.seedInitialEvents();
    await loadEvents();
    notifySuccess('Demo events reset successfully!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Demo Banner if Running in Local Demonstration Mode */}
      {showConfigNotice && (
        <div className="bg-gradient-to-r from-brand-900 via-indigo-900 to-purple-900 text-white text-xs px-4 py-2 border-b border-indigo-700/50">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-brand-500/30 text-brand-200 font-bold uppercase text-[10px]">
                Demo Mode
              </span>
              <p className="text-slate-200">
                Running in zero-config offline presentation mode with pre-seeded campus events. To activate your personal Firebase & Gemini credentials, add them to <code className="bg-white/10 px-1 py-0.5 rounded font-mono text-amber-300">.env.local</code>.
              </p>
            </div>
            <button
              onClick={() => setShowConfigNotice(false)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar />

      {/* Page Routing */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage events={events} />} />
          <Route path="/events" element={<EventsPage events={events} />} />
          <Route path="/events/:id" element={<EventDetailPage onRegistrationSuccess={loadEvents} />} />
          <Route
            path="/my-tickets"
            element={
              isOrganiser ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <MyRegistrationsPage />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              !isOrganiser ? (
                <Navigate to="/events" replace />
              ) : (
                <DashboardPage
                  events={events}
                  onEventCreated={handleEventCreated}
                  onEventUpdated={handleEventUpdated}
                  onEventDeleted={handleEventDeleted}
                  onSeedDemo={handleSeedDemo}
                />
              )
            }
          />
          <Route
            path="/dashboard/events/:id/participants"
            element={
              !isOrganiser ? (
                <Navigate to="/events" replace />
              ) : (
                <EventParticipantsPage />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Floating AI Assistant (Always accessible across pages) */}
      <ChatWidget activeEvents={events} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
export default App;
