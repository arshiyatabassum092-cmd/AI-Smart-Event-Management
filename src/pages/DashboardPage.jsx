import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  Sparkles,
  Users,
  Calendar,
  TrendingUp,
  Edit,
  Trash2,
  ExternalLink,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { EventFormModal } from '../components/events/EventFormModal';
import { eventService } from '../services/eventService';

export const DashboardPage = ({ events = [], onEventCreated, onEventUpdated, onEventDeleted, onSeedDemo }) => {
  const { userProfile } = useAuth();
  const { notifySuccess, notifyError } = useNotification();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventToEdit, setSelectedEventToEdit] = useState(null);

  // Compute metrics
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((sum, e) => sum + (Number(e.registeredCount) || 0), 0);
  const totalCapacity = events.reduce((sum, e) => sum + (Number(e.capacity) || 100), 0);
  const avgOccupancy = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  const handleOpenCreateModal = () => {
    setSelectedEventToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (event) => {
    setSelectedEventToEdit(event);
    setIsModalOpen(true);
  };

  const handleSaveEvent = async (formData, editId) => {
    if (editId) {
      await onEventUpdated(editId, formData);
      notifySuccess('Event updated successfully!');
    } else {
      await onEventCreated(formData);
      notifySuccess('New campus event published successfully!');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await onEventDeleted(id);
      notifySuccess(`Deleted "${title}".`);
    } catch (err) {
      notifyError('Failed to delete event.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-1">
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Campus Event Administration</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Organiser Dashboard
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Welcome back, <strong className="text-slate-800">{userProfile?.displayName || 'Event Coordinator'}</strong>. Manage campus schedules, check attendee lists, and monitor live seat capacities.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onSeedDemo}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 transition-all flex items-center gap-1.5 shadow-sm"
            title="Reset or populate realistic campus events for demo presentation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Events</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white transition-all shadow-md shadow-brand-500/20 hover:shadow-brand-500/30 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Events</span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{totalEvents}</p>
          <span className="text-xs text-slate-500">Active campus events in catalog</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Registrations</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-emerald-600">{totalRegistrations}</p>
          <span className="text-xs text-slate-500">Student tickets issued</span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average Occupancy</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-indigo-600">{avgOccupancy}%</p>
          <span className="text-xs text-slate-500">Across all scheduled venues</span>
        </div>
      </div>

      {/* Events Management Table Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-extrabold text-lg text-slate-900">Events Management</h2>
          <span className="text-xs text-slate-500 font-medium">
            {events.length} listed event{events.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Event Title & Category</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Venue</th>
                <th className="px-6 py-4">Registrations</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((event) => {
                const capacity = Number(event.capacity) || 100;
                const registered = Number(event.registeredCount) || 0;
                const percentage = Math.min(100, Math.round((registered / capacity) * 100));

                return (
                  <tr key={event.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* Title & Category */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={event.bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=120&q=80'}
                          alt=""
                          className="w-12 h-12 rounded-xl object-cover shrink-0 shadow-sm"
                        />
                        <div>
                          <Link
                            to={`/events/${event.id}`}
                            className="font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                          >
                            {event.title}
                          </Link>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wide bg-slate-100 text-slate-600">
                            {event.category}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4 text-xs">
                      <p className="font-semibold text-slate-800">{event.date}</p>
                      <p className="text-slate-500">{event.time}</p>
                    </td>

                    {/* Venue */}
                    <td className="px-6 py-4 text-xs font-medium text-slate-700 max-w-[160px] truncate">
                      {event.venue}
                    </td>

                    {/* Registrations Progress */}
                    <td className="px-6 py-4 text-xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold text-slate-800">{registered} / {capacity}</span>
                        <span className="font-semibold text-slate-500">{percentage}%</span>
                      </div>
                      <div className="w-28 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${percentage > 85 ? 'bg-rose-500' : 'bg-brand-500'}`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/dashboard/events/${event.id}/participants`}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                          title="View Registrations"
                        >
                          <Users className="w-4 h-4" />
                          <span className="hidden md:inline">Participants</span>
                        </Link>

                        <button
                          onClick={() => handleOpenEditModal(event)}
                          className="p-2 text-slate-500 hover:text-brand-600 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Edit Event"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(event.id, event.title)}
                          className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Form Modal for Create & Edit */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        eventToEdit={selectedEventToEdit}
      />
    </div>
  );
};
