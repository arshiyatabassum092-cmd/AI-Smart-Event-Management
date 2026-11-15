import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Default mock user profile for seamless demo when Firebase isn't configured
  const initDemoUser = (role = 'student') => ({
    uid: role === 'organiser' ? 'org-demo-user-101' : 'student-demo-user-202',
    email: role === 'organiser' ? 'organiser@campus.edu' : 'student@campus.edu',
    displayName: role === 'organiser' ? 'Prof. Alex Turner (Faculty Coordinator)' : 'Sarah Jenkins (Student)',
    role: role,
    college: 'Campus Institute of Technology',
    department: 'Computer Science & Engineering',
    yearOfStudy: '3rd Year'
  });

  useEffect(() => {
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          // Fetch role from Firestore
          if (db) {
            try {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              if (userDoc.exists()) {
                setUserProfile(userDoc.data());
              } else {
                // Default profile if document doesn't exist
                const defaultProf = {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName || user.email.split('@')[0],
                  role: 'student',
                  college: 'Campus Institute of Technology',
                  department: 'General Sciences',
                  yearOfStudy: '1st Year'
                };
                await setDoc(doc(db, 'users', user.uid), defaultProf);
                setUserProfile(defaultProf);
              }
            } catch (e) {
              console.warn('Error reading user profile from Firestore:', e);
              setUserProfile({
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                role: 'student'
              });
            }
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Local demo mode: check localStorage or load demo student
      const savedUser = localStorage.getItem('smart_events_demo_user');
      if (savedUser) {
        try {
          const parsed = JSON.parse(savedUser);
          // Ensure uid matches role if previously stored with legacy mismatched uid
          if (parsed.role === 'organiser' && parsed.uid === 'student-demo-user-202') {
            parsed.uid = 'org-demo-user-101';
            localStorage.setItem('smart_events_demo_user', JSON.stringify(parsed));
          } else if (parsed.role === 'student' && parsed.uid === 'org-demo-user-101') {
            parsed.uid = 'student-demo-user-202';
            localStorage.setItem('smart_events_demo_user', JSON.stringify(parsed));
          }
          setCurrentUser(parsed);
          setUserProfile(parsed);
        } catch {
          const demo = initDemoUser('student');
          setCurrentUser(demo);
          setUserProfile(demo);
        }
      } else {
        const demo = initDemoUser('student');
        setCurrentUser(demo);
        setUserProfile(demo);
        localStorage.setItem('smart_events_demo_user', JSON.stringify(demo));
      }
      setLoading(false);
    }
  }, []);

  // 1. Email Sign Up
  const signup = async (email, password, displayName, role = 'student', meta = {}) => {
    if (isFirebaseConfigured && auth) {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName });
      const newProf = {
        uid: res.user.uid,
        email,
        displayName,
        role: 'student',
        college: meta.college || 'Campus Institute of Technology',
        department: meta.department || 'Computer Science',
        yearOfStudy: meta.yearOfStudy || '2nd Year',
        createdAt: new Date().toISOString()
      };
      if (db) {
        await setDoc(doc(db, 'users', res.user.uid), newProf);
      }
      setUserProfile(newProf);
      return res.user;
    } else {
      const localUser = {
        uid: `user-${Date.now()}`,
        email,
        displayName,
        role,
        ...meta
      };
      setCurrentUser(localUser);
      setUserProfile(localUser);
      localStorage.setItem('smart_events_demo_user', JSON.stringify(localUser));
      return localUser;
    }
  };

  // 2. Email Login
  const login = async (email, password) => {
    if (isFirebaseConfigured && auth) {
      return signInWithEmailAndPassword(auth, email, password);
    } else {
      // Simulate login
      const localUser = {
        uid: `user-sim-${Date.now()}`,
        email,
        displayName: email.split('@')[0],
        role: email.toLowerCase().includes('org') ? 'organiser' : 'student',
        college: 'Campus Institute of Technology',
        department: 'Engineering'
      };
      setCurrentUser(localUser);
      setUserProfile(localUser);
      localStorage.setItem('smart_events_demo_user', JSON.stringify(localUser));
      return localUser;
    }
  };

  // 3. Google Sign In
  
const loginWithGoogle = async (preferredRole = 'student') => {
  if (isFirebaseConfigured && auth && googleProvider && db) {
    const res = await signInWithPopup(auth, googleProvider);

    const userRef = doc(db, 'users', res.user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      // Load the existing user's actual Firebase role
      const profile = {
        ...userDoc.data(),
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName || userDoc.data().displayName
      };

      setCurrentUser(res.user);
      setUserProfile(profile);
      console.log("FIREBASE USER ROLE:", profile.role);
    } else {
      // New accounts always start as students
      const newProf = {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        role: 'student',
        college: 'Campus Institute of Technology',
        department: 'Computer Science',
        yearOfStudy: '2nd Year',
        createdAt: new Date().toISOString()
      };

      await setDoc(userRef, newProf);

      setCurrentUser(res.user);
      setUserProfile(newProf);
    }

    return res.user;
  } else {
    const demo = initDemoUser(preferredRole);
    setCurrentUser(demo);
    setUserProfile(demo);
    localStorage.setItem('smart_events_demo_user', JSON.stringify(demo));
    return demo;
  }
};


  // 4. Logout
  const logout = async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setCurrentUser(null);
    setUserProfile(null);
    localStorage.removeItem('smart_events_demo_user');
  };

  // 5. Presentation Demo Helper: Switch roles quickly for viva evaluation
  const switchDemoRole = (newRole) => {
  // Real Firebase users cannot change their permissions using this button.
  if (isFirebaseConfigured) return;

  // This switch is only for local demo mode.
  if (!currentUser) return;

  const demoUser = {
    ...currentUser,
    role: newRole
  };

  setCurrentUser(demoUser);
  setUserProfile(demoUser);
  localStorage.setItem('smart_events_demo_user', JSON.stringify(demoUser));
};

  const isOrganiser = userProfile?.role === 'organiser' || userProfile?.role === 'admin';

  const value = {
    currentUser,
    userProfile,
    isOrganiser,
    isStudent: !isOrganiser,
    signup,
    login,
    loginWithGoogle,
    logout,
    switchDemoRole,
    isFirebaseConfigured
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
