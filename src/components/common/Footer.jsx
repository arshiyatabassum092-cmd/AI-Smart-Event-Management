import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Github, Heart, Sparkles, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Footer = () => {
  const { isOrganiser } = useAuth();
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Calendar className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                SmartEvents<span className="text-brand-400">.AI</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              An intelligent campus event discovery and registration platform engineered for college students and faculty organizers. Powered by Google Gemini AI and Firebase.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                React 18
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-950/60 text-amber-400 border border-amber-800/40">
                Firebase Firestore
              </span>
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-950/60 text-indigo-400 border border-indigo-800/40">
                Gemini 1.5 Flash
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-brand-400 transition-colors">Home Overview</Link></li>
              <li><Link to="/events" className="hover:text-brand-400 transition-colors">Upcoming Events</Link></li>
              {!isOrganiser && (
                <li><Link to="/my-tickets" className="hover:text-brand-400 transition-colors">My Event Passes</Link></li>
              )}
              {isOrganiser && (
                <li><Link to="/dashboard" className="hover:text-brand-400 transition-colors">Organiser Dashboard</Link></li>
              )}
            </ul>
          </div>

          {/* Internship Project Meta */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-xs uppercase tracking-wider">Internship Details</h4>
            <p className="text-xs text-slate-400 mb-2">
              <strong className="text-slate-200">Track:</strong> AI-Driven Software Development
            </p>
            <p className="text-xs text-slate-400 mb-3">
              <strong className="text-slate-200">Deployment:</strong> Vercel + GitHub CI/CD
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-brand-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              Ready for Mentor Review
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} AI-Powered Smart Event Management System. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with dedication for student campus engagement
          </p>
        </div>
      </div>
    </footer>
  );
};
