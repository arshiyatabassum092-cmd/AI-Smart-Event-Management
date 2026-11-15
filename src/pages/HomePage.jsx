import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Users,
  Award,
  ArrowRight,
  CheckCircle2,
  Ticket,
  Bot,
  Zap,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { EventCard } from '../components/events/EventCard';
import { useAuth } from '../context/AuthContext';

export const HomePage = ({ events = [] }) => {
  const { isOrganiser, switchDemoRole } = useAuth();
  const featuredEvents = events.slice(0, 3);
  const totalRegistrations = events.reduce((sum, e) => sum + (e.registeredCount || 0), 0);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Background gradient decorative shapes */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-brand-100/60 via-indigo-50/40 to-transparent blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
            <span>Next-Generation AI Campus Event Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Discover, Register & Host Campus Events with{' '}
            <span className="bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              AI Intelligence
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            From technical hackathons and hands-on workshops to cultural fests and sports championships. Get instant digital passes and personalized event guidance powered by Gemini AI.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/events"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm text-white bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-500/25 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl font-bold text-sm text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4 text-brand-500" />
              <span>Organiser Dashboard</span>
            </Link>
          </div>

          {/* Live Campus Metric Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-3xl bg-white/80 backdrop-blur-md border border-slate-200/80 shadow-md">
            <div className="p-3 text-center border-r border-slate-100 last:border-0">
              <span className="block text-2xl sm:text-3xl font-extrabold text-slate-900">{events.length}+</span>
              <span className="text-xs text-slate-500 font-medium">Scheduled Events</span>
            </div>
            <div className="p-3 text-center sm:border-r border-slate-100">
              <span className="block text-2xl sm:text-3xl font-extrabold text-brand-600">{totalRegistrations}+</span>
              <span className="text-xs text-slate-500 font-medium">Active Registrations</span>
            </div>
            <div className="p-3 text-center border-r border-slate-100">
              <span className="block text-2xl sm:text-3xl font-extrabold text-indigo-600">8</span>
              <span className="text-xs text-slate-500 font-medium">College Clubs</span>
            </div>
            <div className="p-3 text-center">
              <span className="block text-2xl sm:text-3xl font-extrabold text-emerald-600">99.8%</span>
              <span className="text-xs text-slate-500 font-medium">Student Satisfaction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Handpicked Highlights</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Upcoming Events
            </h2>
          </div>
          <Link
            to="/events"
            className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 group"
          >
            <span>View all {events.length} events</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </section>

      {/* Features & Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-400 block mb-2">
              Modern Campus Event Infrastructure
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold leading-tight">
              Engineered for Seamless Engagement Between Students and Coordinators
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg text-white">Gemini AI Concierge</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Integrated Google Gemini AI assistant grounded with live event data to answer queries, check eligibility, and recommend clubs.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Ticket className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg text-white">Instant Digital Passes</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Zero friction booking with unique ticket codes and QR code badges. Duplicate registrations are blocked automatically.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-lg text-white">Organiser Command Center</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Publish events with custom banners, monitor live seat occupancy, review attendee lists, and export registration CSVs for attendance.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
