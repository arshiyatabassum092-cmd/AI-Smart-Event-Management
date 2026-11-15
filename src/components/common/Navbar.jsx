import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Calendar,
  Sparkles,
  LayoutDashboard,
  Ticket,
  LogOut,
  User,
  Menu,
  X,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';

export const Navbar = () => {
  const { currentUser, userProfile, isOrganiser, logout, switchDemoRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleRoleSwitch = (newRole) => {
    switchDemoRole(newRole);
    if (newRole === 'organiser' && location.pathname === '/my-tickets') {
      navigate('/dashboard');
    } else if (newRole === 'student' && location.pathname.startsWith('/dashboard')) {
      navigate('/events');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-brand-800 to-indigo-600 bg-clip-text text-transparent">
                SmartEvents<span className="text-brand-600">.AI</span>
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-brand-50 text-brand-700 rounded-md border border-brand-200/60">
                Campus Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'text-brand-600 bg-brand-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/events"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/events')
                  ? 'text-brand-600 bg-brand-50/80 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
              }`}
            >
              Explore Events
            </Link>

            {/* Student Mode: Show My Passes */}
            {!isOrganiser && (
              <Link
                to="/my-tickets"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/my-tickets')
                    ? 'text-brand-600 bg-brand-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <Ticket className="w-4 h-4 text-brand-500" />
                My Passes
              </Link>
            )}

            {/* Organiser Mode: Show Organiser Dashboard */}
            {isOrganiser && (
              <Link
                to="/dashboard"
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive('/dashboard') || location.pathname.startsWith('/dashboard')
                    ? 'text-brand-600 bg-brand-50/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                Organiser Dashboard
              </Link>
            )}
          </nav>

          {/* Right Action Section */}
          <div className="hidden md:flex items-center gap-3">
            {/* Presentation Role Switcher Pill */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-medium">
              <button
                onClick={() => handleRoleSwitch('student')}
                title="Switch view to Student mode"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  !isOrganiser
                    ? 'bg-white text-brand-700 shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                Student
              </button>
              <button
                onClick={() => handleRoleSwitch('organiser')}
                title="Switch view to Organiser mode"
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                  isOrganiser
                    ? 'bg-brand-600 text-white shadow-sm font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Organiser
              </button>
            </div>

            {currentUser ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-2 text-left">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
                    {userProfile?.displayName ? userProfile.displayName.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden lg:block text-xs">
                    <p className="font-semibold text-slate-800 leading-tight truncate max-w-[120px]">
                      {userProfile?.displayName || 'User'}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">
                      {userProfile?.role || 'Member'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/20 transition-all hover:shadow-brand-500/30"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="flex justify-between items-center bg-slate-50 p-2 rounded-xl mb-2">
            <span className="text-xs font-semibold text-slate-600">Active Role Mode:</span>
            <div className="flex gap-1 text-xs">
              <button
                onClick={() => { handleRoleSwitch('student'); setMobileMenuOpen(false); }}
                className={`px-2 py-1 rounded-md ${!isOrganiser ? 'bg-brand-600 text-white' : 'bg-slate-200'}`}
              >
                Student
              </button>
              <button
                onClick={() => { handleRoleSwitch('organiser'); setMobileMenuOpen(false); }}
                className={`px-2 py-1 rounded-md ${isOrganiser ? 'bg-brand-600 text-white' : 'bg-slate-200'}`}
              >
                Organiser
              </button>
            </div>
          </div>

          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            to="/events"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore Events
          </Link>
          {!isOrganiser && (
            <Link
              to="/my-tickets"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
            >
              My Passes
            </Link>
          )}
          {isOrganiser && (
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-brand-600 font-semibold hover:bg-brand-50"
            >
              Organiser Dashboard
            </Link>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="text-sm font-medium text-slate-700">
              {userProfile?.displayName || 'Campus User'}
            </div>
            <button
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="text-xs text-rose-600 font-semibold"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
