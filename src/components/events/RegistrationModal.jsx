import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { registrationService } from '../../services/registrationService';
import {
  X,
  Ticket,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  QrCode,
  Download,
  AlertCircle
} from 'lucide-react';

export const RegistrationModal = ({ event, isOpen, onClose, onRegistrationSuccess }) => {
  const { currentUser, userProfile } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [formData, setFormData] = useState({
    fullName: userProfile?.displayName || '',
    email: userProfile?.email || currentUser?.email || '',
    phone: '',
    college: userProfile?.college || 'Campus Institute of Technology',
    department: userProfile?.department || 'Computer Science',
    yearOfStudy: userProfile?.yearOfStudy || '3rd Year'
  });

  const [loading, setLoading] = useState(false);
  const [confirmedTicket, setConfirmedTicket] = useState(null);

  if (!isOpen || !event) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      notifyError('Please fill in all mandatory fields.');
      return;
    }

    try {
      setLoading(true);
      const userObj = currentUser || { uid: `guest-${Date.now()}`, email: formData.email };
      const ticket = await registrationService.registerForEvent(event, userObj, formData);
      
      setConfirmedTicket(ticket);
      notifySuccess('Registration Confirmed! Your digital pass is ready.');

      // Fire celebratory confetti!
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      if (onRegistrationSuccess) {
        onRegistrationSuccess(ticket);
      }
    } catch (err) {
      notifyError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2 text-brand-700">
            <Ticket className="w-5 h-5" />
            <h3 className="font-bold text-slate-800 text-base">
              {confirmedTicket ? 'Event Pass Issued' : 'Event Registration'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          {!confirmedTicket ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Event Summary Box */}
              <div className="bg-brand-50/60 border border-brand-100 rounded-2xl p-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600 block mb-1">
                  You are registering for:
                </span>
                <h4 className="font-bold text-slate-900 text-base mb-2">{event.title}</h4>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-500" /> {event.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-brand-500" /> {event.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" /> {event.venue}
                  </span>
                </div>
              </div>

              {/* Form Inputs */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="student@college.edu"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    placeholder="e.g. Computer Science"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Year of Study</label>
                  <select
                    name="yearOfStudy"
                    value={formData.yearOfStudy}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">College / Institution</label>
                <input
                  type="text"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  placeholder="College Name"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>

              <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                Admission is subject to college eligibility criteria. Digital pass issued immediately.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Confirm Registration (Free)'}
              </button>
            </form>
          ) : (
            /* Digital Ticket Card View */
            <div className="space-y-5 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-xl font-extrabold text-slate-900">You're All Set!</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your ticket has been confirmed. Present this pass at the entrance.
                </p>
              </div>

              {/* Digital Pass Aesthetic Box */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-5 text-left shadow-lg border border-indigo-900/50 relative overflow-hidden">
                <div className="flex justify-between items-start mb-3 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Digital Event Pass</span>
                    <h5 className="font-bold text-base text-white leading-tight">{confirmedTicket.eventTitle}</h5>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Ticket ID</span>
                    <span className="font-mono text-xs font-bold text-amber-400">{confirmedTicket.ticketId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Attendee</span>
                    <span className="font-semibold text-slate-100">{confirmedTicket.participantName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Department</span>
                    <span className="font-semibold text-slate-100">{confirmedTicket.department}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Date & Time</span>
                    <span className="text-slate-100">{confirmedTicket.eventDate} | {confirmedTicket.eventTime}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Venue</span>
                    <span className="text-slate-100 truncate block">{confirmedTicket.eventVenue}</span>
                  </div>
                </div>

                {/* Simulated QR Code */}
                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="bg-white p-1 rounded-lg">
                      <QrCode className="w-8 h-8 text-slate-900" />
                    </div>
                    <span className="text-[10px] text-slate-300">Scan at entrance for attendance</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    VERIFIED
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-200 text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Print / Save Pass
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-semibold bg-brand-600 hover:bg-brand-700 text-white"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
