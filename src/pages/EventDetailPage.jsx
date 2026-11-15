import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldAlert,
  ArrowLeft,
  Share2,
  CheckCircle,
  Ticket,
  UserCheck,
  Building
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { RegistrationModal } from '../components/events/RegistrationModal';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export const EventDetailPage = ({ onRegistrationSuccess }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isOrganiser } = useAuth();
  const { notifySuccess, notifyInfo } = useNotification();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        setLoading(true);
        const data = await eventService.getEventById(id);
        if (data) {
          setEvent(data);
          if (currentUser) {
            const registered = await registrationService.isUserRegistered(id, currentUser.uid);
            setIsRegistered(registered);
          }
        }
      } catch (err) {
        console.error('Failed to load event details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEventData();
  }, [id, currentUser]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    notifySuccess('Event link copied to clipboard!');
  };

  const handleRegistrationComplete = (ticket) => {
    setIsRegistered(true);
    setEvent((prev) => ({
      ...prev,
      registeredCount: (prev.registeredCount || 0) + 1
    }));
    if (onRegistrationSuccess) {
      onRegistrationSuccess();
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-sm text-slate-500 font-medium">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Event Not Found</h2>
        <p className="text-sm text-slate-500 mb-6">The requested campus event does not exist or has been removed.</p>
        <Link
          to="/events"
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-sm hover:bg-brand-700"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  const capacity = Number(event.capacity) || 100;
  const registered = Number(event.registeredCount) || 0;
  const seatsLeft = Math.max(0, capacity - registered);
  const percentage = Math.min(100, Math.round((registered / capacity) * 100));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all shadow-sm"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Share Event</span>
        </button>
      </div>

      {/* Main Banner Header */}
      <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-[16/9] max-h-[380px] w-full bg-slate-900">
        <img
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80'}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <span className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-600 text-white shadow-md">
            {event.category}
          </span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-2">
            {event.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 flex items-center gap-2">
            <Building className="w-4 h-4 text-brand-400" />
            Organized by: <strong className="text-white">{event.organiserName || 'Campus Faculty / Student Council'}</strong>
          </p>
        </div>
      </div>

      {/* Grid Layout: Details & Registration Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Full Event Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Facts Pill Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Date</span>
                <span className="text-sm font-semibold text-slate-800">{event.date}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Time</span>
                <span className="text-sm font-semibold text-slate-800">{event.time}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Venue</span>
                <span className="text-sm font-semibold text-slate-800 leading-snug">{event.venue}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">Eligibility</span>
                <span className="text-sm font-semibold text-slate-800 leading-snug">{event.eligibility}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-3">
            <h3 className="font-bold text-lg text-slate-900">About this Event</h3>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-400">Tags:</span>
              {event.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Live Booking Card */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-lg sticky top-24 space-y-6">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Seat Availability
              </span>
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-3xl font-extrabold text-slate-900">{seatsLeft}</span>
                <span className="text-xs font-bold text-slate-400">Total capacity: {capacity}</span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    percentage > 85 ? 'bg-rose-500' : 'bg-brand-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>{registered} Registered</span>
                <span>{percentage}% Occupancy</span>
              </div>
            </div>

            {/* Registration Action */}
            <div className="pt-2">
              {isOrganiser ? (
                <div className="space-y-3">
                  <Link
                    to={`/dashboard/events/${event.id}/participants`}
                    className="w-full py-3 px-4 rounded-2xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
                  >
                    <Users className="w-4 h-4" />
                    <span>Manage Participants ({registered})</span>
                  </Link>
                  <Link
                    to="/dashboard"
                    className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Back to Dashboard</span>
                  </Link>
                </div>
              ) : isRegistered ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-emerald-900">You're Registered!</h4>
                  <p className="text-xs text-emerald-700">
                    Your digital pass is stored in your account.
                  </p>
                  <Link
                    to="/my-tickets"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 underline hover:text-emerald-950 pt-1"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    View My Pass
                  </Link>
                </div>
              ) : seatsLeft === 0 ? (
                <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-center">
                  <p className="font-bold text-sm text-rose-800">Event Full (Sold Out)</p>
                  <p className="text-xs text-rose-600 mt-1">All available student seats have been claimed.</p>
                </div>
              ) : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3.5 px-4 rounded-2xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                >
                  <Ticket className="w-4 h-4" />
                  <span>Register for Event (Free)</span>
                </button>
              )}
            </div>

            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Instant digital QR badge confirmation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Automated college attendance tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        event={event}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRegistrationSuccess={handleRegistrationComplete}
      />
    </div>
  );
};
