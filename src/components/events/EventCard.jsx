import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

const CATEGORY_COLORS = {
  Technical: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  Workshop: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Cultural: 'bg-amber-50 text-amber-700 border-amber-200',
  Sports: 'bg-rose-50 text-rose-700 border-rose-200',
  Seminar: 'bg-purple-50 text-purple-700 border-purple-200',
  default: 'bg-slate-50 text-slate-700 border-slate-200'
};

export const EventCard = ({ event }) => {
  const categoryClass = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.default;
  const capacity = Number(event.capacity) || 100;
  const registered = Number(event.registeredCount) || 0;
  const seatsLeft = Math.max(0, capacity - registered);
  const percentage = Math.min(100, Math.round((registered / capacity) * 100));

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Event Banner */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100">
        <img
          src={event.bannerUrl || 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide border shadow-sm backdrop-blur-md ${categoryClass}`}>
            {event.category}
          </span>
        </div>

        {/* Seats Remaining Pill */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md shadow-sm ${
            seatsLeft <= 10
              ? 'bg-rose-500/90 text-white'
              : 'bg-slate-900/80 text-white'
          }`}>
            {seatsLeft === 0 ? 'Sold Out' : `${seatsLeft} seats left`}
          </span>
        </div>

        {/* Date on image */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-xs font-medium">
          <Calendar className="w-4 h-4 text-brand-300" />
          <span>{event.date}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1 mb-2">
            {event.title}
          </h3>
          <p className="text-slate-600 text-sm line-clamp-2 mb-4 leading-relaxed">
            {event.description}
          </p>

          <div className="space-y-2 text-xs text-slate-500 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Registration Progress & Action */}
        <div className="pt-4 border-t border-slate-100 mt-2">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {registered} / {capacity} Registered
            </span>
            <span className="font-semibold text-slate-700">{percentage}%</span>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage > 85 ? 'bg-rose-500' : 'bg-brand-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <Link
            to={`/events/${event.id}`}
            className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-slate-900 hover:bg-brand-600 text-white transition-all shadow-sm group-hover:shadow-md"
          >
            <span>View Details & Register</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
