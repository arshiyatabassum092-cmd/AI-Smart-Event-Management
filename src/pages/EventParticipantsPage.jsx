import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Users,
  ArrowLeft,
  Download,
  Search,
  CheckCircle2,
  Calendar,
  Building,
  Mail,
  Phone,
  Ticket
} from 'lucide-react';
import { eventService } from '../services/eventService';
import { registrationService } from '../services/registrationService';
import { useNotification } from '../context/NotificationContext';

export const EventParticipantsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notifyInfo } = useNotification();

  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const eventData = await eventService.getEventById(id);
        setEvent(eventData);

        const list = await registrationService.getEventParticipants(id);
        setParticipants(list);
      } catch (err) {
        console.error('Failed to load participants:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const filteredParticipants = participants.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.participantName?.toLowerCase().includes(q) ||
      p.participantEmail?.toLowerCase().includes(q) ||
      p.ticketId?.toLowerCase().includes(q) ||
      p.department?.toLowerCase().includes(q)
    );
  });

  const handleExport = () => {
    if (!participants.length) {
      notifyInfo('No participants to export.');
      return;
    }
    registrationService.exportToCSV(participants, event?.title || 'event');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Organiser Dashboard</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Participant Roster</span>
            <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {participants.length} Registrations
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Event: <strong className="text-slate-800">{event?.title || 'Loading...'}</strong> ({event?.date} at {event?.venue})
          </p>
        </div>

        {/* Export Button */}
        <div>
          <button
            onClick={handleExport}
            disabled={!participants.length}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV for Attendance</span>
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search attendee by name, email, department, or ticket ID..."
          className="w-full text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-slate-500 font-medium">Loading attendee roster...</p>
          </div>
        ) : filteredParticipants.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Ticket ID</th>
                  <th className="px-6 py-4">Participant Name</th>
                  <th className="px-6 py-4">Contact Info</th>
                  <th className="px-6 py-4">College & Dept</th>
                  <th className="px-6 py-4">Registered Date</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParticipants.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Ticket ID */}
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-brand-700 bg-brand-50 px-2 py-1 rounded-md border border-brand-200/60">
                        {p.ticketId || 'TKT-PENDING'}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900">{p.participantName}</p>
                      <p className="text-xs text-slate-500">{p.yearOfStudy || 'Student'}</p>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate">{p.participantEmail}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{p.participantPhone || 'N/A'}</span>
                      </div>
                    </td>

                    {/* College & Department */}
                    <td className="px-6 py-4 text-xs">
                      <p className="font-semibold text-slate-800">{p.department || 'General'}</p>
                      <p className="text-slate-500 truncate max-w-[150px]">{p.college}</p>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : 'Recent'}
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Confirmed
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 p-8">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-base mb-1">
              {searchQuery ? 'No attendees match search query' : 'No registrations yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery
                ? 'Try clearing your search query to see all participants.'
                : 'As students register online through the event page, their entries will show up here.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
