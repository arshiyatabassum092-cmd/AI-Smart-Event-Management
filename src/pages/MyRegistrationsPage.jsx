import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, Clock, MapPin, QrCode, Trash2, Download, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { registrationService } from '../services/registrationService';

export const MyRegistrationsPage = () => {
  const { currentUser, userProfile } = useAuth();
  const { notifySuccess, notifyError } = useNotification();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrations = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await registrationService.getUserRegistrations(currentUser.uid);
        setRegistrations(data);
      } catch (err) {
        console.error('Failed to fetch user registrations:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, [currentUser]);

  const handleCancelRegistration = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel your registration for this event?')) {
      return;
    }

    try {
      await registrationService.cancelRegistration(eventId, currentUser.uid);
      setRegistrations((prev) => prev.filter((r) => r.eventId !== eventId));
      notifySuccess('Registration cancelled successfully.');
    } catch (err) {
      notifyError('Failed to cancel registration.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Ticket className="w-3.5 h-3.5" />
          <span>Student Portal</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          My Event Passes
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Manage your confirmed registrations and present these digital passes at the event venue.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500 font-medium">Loading your passes...</p>
        </div>
      ) : registrations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {registrations.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between"
            >
              {/* Ticket Top Banner */}
              <div className="bg-gradient-to-r from-slate-900 via-brand-950 to-indigo-950 text-white p-5">
                <div className="flex items-start justify-between mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-500/20 text-brand-300 border border-brand-400/30">
                    {ticket.eventCategory || 'Campus Event'}
                  </span>
                  <span className="font-mono text-xs font-bold text-amber-300">
                    {ticket.ticketId}
                  </span>
                </div>
                <h3 className="font-extrabold text-lg text-white leading-tight">
                  {ticket.eventTitle}
                </h3>
              </div>

              {/* Ticket Body */}
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">ATTENDEE</span>
                    <span className="font-bold text-slate-800">{ticket.participantName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">DEPARTMENT</span>
                    <span className="font-bold text-slate-800 truncate block">{ticket.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">DATE & TIME</span>
                    <span className="text-slate-700 font-medium">{ticket.eventDate} | {ticket.eventTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold">VENUE</span>
                    <span className="text-slate-700 font-medium truncate block">{ticket.eventVenue}</span>
                  </div>
                </div>

                {/* QR Code Bar */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-1 rounded-lg border border-slate-200">
                      <QrCode className="w-7 h-7 text-slate-800" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase block">STATUS</span>
                      <span className="text-xs font-bold text-emerald-600">CONFIRMED PASS</span>
                    </div>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="p-2 text-slate-500 hover:text-brand-600 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                    title="Print or Save Ticket"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ticket Footer Actions */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to={`/events/${ticket.eventId}`}
                  className="font-semibold text-brand-600 hover:text-brand-700"
                >
                  View Event Page →
                </Link>
                <button
                  onClick={() => handleCancelRegistration(ticket.eventId)}
                  className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Cancel Registration
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
            <Ticket className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">No event passes yet</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            You haven't registered for any campus events. Discover workshops, hackathons, and tournaments to join!
          </p>
          <Link
            to="/events"
            className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-md shadow-brand-500/20"
          >
            Explore Events
          </Link>
        </div>
      )}
    </div>
  );
};
