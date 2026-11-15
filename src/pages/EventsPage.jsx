import React, { useState, useMemo } from 'react';
import { Calendar, Search, Sparkles } from 'lucide-react';
import { EventCard } from '../components/events/EventCard';
import { EventFilter } from '../components/events/EventFilter';

export const EventsPage = ({ events = [] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('upcoming');

  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Category filter
    if (selectedCategory !== 'All') {
      result = result.filter(
        (e) => e.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query filter (matches title, description, venue, or tags)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.title?.toLowerCase().includes(q) ||
          e.description?.toLowerCase().includes(q) ||
          e.venue?.toLowerCase().includes(q) ||
          e.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Sort order
    if (sortBy === 'popular') {
      result.sort((a, b) => (b.registeredCount || 0) - (a.registeredCount || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else {
      // upcoming (chronological by date)
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return result;
  }, [events, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-brand-600 text-xs font-bold uppercase tracking-wider mb-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>Campus Events Directory</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Campus Events
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          Find workshops, hackathons, guest lectures, cultural fests, and tournaments across campus departments.
        </p>
      </div>

      {/* Filter Component */}
      <EventFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
        <span>
          Showing <strong className="text-slate-800">{filteredEvents.length}</strong> event{filteredEvents.length === 1 ? '' : 's'}
          {selectedCategory !== 'All' && ` in "${selectedCategory}"`}
        </span>
      </div>

      {/* Events Grid */}
      {filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-14 h-14 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-lg mb-1">No matching events found</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
            Try adjusting your search terms or choose a different category filter.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-600 text-white hover:bg-brand-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
