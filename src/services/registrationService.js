import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  increment,
  updateDoc
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

const REG_STORAGE_KEY = 'smart_events_registrations';

const getLocalRegistrations = () => {
  const data = localStorage.getItem(REG_STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveLocalRegistrations = (registrations) => {
  localStorage.setItem(REG_STORAGE_KEY, JSON.stringify(registrations));
};

export const registrationService = {
  // 1. Register a participant
  async registerForEvent(event, user, participantDetails) {
    if (!event || !user) throw new Error('Event and User information are required.');

    const registrationId = `${event.id}_${user.uid}`;
    const ticketId = `EVT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const registrationDoc = {
      id: registrationId,
      eventId: event.id,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      eventCategory: event.category,
      userId: user.uid,
      participantName: participantDetails.fullName || user.displayName || 'Anonymous Student',
      participantEmail: participantDetails.email || user.email,
      participantPhone: participantDetails.phone || 'N/A',
      college: participantDetails.college || 'College of Engineering',
      department: participantDetails.department || 'Computer Science',
      yearOfStudy: participantDetails.yearOfStudy || '3rd Year',
      ticketId,
      status: 'confirmed',
      registeredAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        // Enforce 1 registration per user per event via composite document ID
        const docRef = doc(db, 'registrations', registrationId);
        await setDoc(docRef, {
          ...registrationDoc,
          serverTimestamp: serverTimestamp()
        });

        // Increment registeredCount on the event
        const eventRef = doc(db, 'events', event.id);
        await updateDoc(eventRef, {
          registeredCount: increment(1)
        });

        return registrationDoc;
      } catch (err) {
        console.warn('Firestore registration failed, falling back locally:', err);
      }
    }

    // Local fallback
    const list = getLocalRegistrations();
    const existingIndex = list.findIndex(r => r.id === registrationId);
    if (existingIndex !== -1) {
      throw new Error('You have already registered for this event.');
    }

    list.push(registrationDoc);
    saveLocalRegistrations(list);

    // Also update local event counter
    try {
      const storedEvents = JSON.parse(localStorage.getItem('smart_events_catalogue') || '[]');
      const evt = storedEvents.find(e => e.id === event.id);
      if (evt) {
        evt.registeredCount = (evt.registeredCount || 0) + 1;
        localStorage.setItem('smart_events_catalogue', JSON.stringify(storedEvents));
      }
    } catch {}

    return registrationDoc;
  },

  // 2. Check if a user is registered for an event
  async isUserRegistered(eventId, userId) {
    if (!eventId || !userId) return false;

    if (isFirebaseConfigured && db) {
      try {
        const regRef = doc(db, 'registrations', `${eventId}_${userId}`);
        const snap = await getDocs(query(collection(db, 'registrations'), where('eventId', '==', eventId), where('userId', '==', userId)));
        return !snap.empty;
      } catch (e) {
        console.warn('Error checking registration status in Firestore:', e);
      }
    }

    const list = getLocalRegistrations();
    return list.some(r => r.eventId === eventId && r.userId === userId);
  },

  // 3. Get all registrations for a specific student
  async getUserRegistrations(userId) {
    if (!userId) return [];

    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'registrations'), where('userId', '==', userId));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.warn('Error fetching user registrations from Firestore:', err);
      }
    }

    const list = getLocalRegistrations();
    return list.filter(r => r.userId === userId);
  },

  // 4. Get all participants for a specific event (Organiser view)
  async getEventParticipants(eventId) {
    if (!eventId) return [];

    if (isFirebaseConfigured && db) {
      try {
        const q = query(collection(db, 'registrations'), where('eventId', '==', eventId));
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...d.data() }));
      } catch (err) {
        console.warn('Error fetching event participants from Firestore:', err);
      }
    }

    const list = getLocalRegistrations();
    return list.filter(r => r.eventId === eventId);
  },

  // 5. Cancel registration
  async cancelRegistration(eventId, userId) {
    const registrationId = `${eventId}_${userId}`;

    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'registrations', registrationId);
        await deleteDoc(docRef);

        const eventRef = doc(db, 'events', eventId);
        await updateDoc(eventRef, {
          registeredCount: increment(-1)
        });
        return true;
      } catch (err) {
        console.warn('Firestore cancellation failed:', err);
      }
    }

    const list = getLocalRegistrations();
    const updated = list.filter(r => r.id !== registrationId);
    saveLocalRegistrations(updated);

    try {
      const storedEvents = JSON.parse(localStorage.getItem('smart_events_catalogue') || '[]');
      const evt = storedEvents.find(e => e.id === eventId);
      if (evt && evt.registeredCount > 0) {
        evt.registeredCount -= 1;
        localStorage.setItem('smart_events_catalogue', JSON.stringify(storedEvents));
      }
    } catch {}

    return true;
  },

  // 6. Export participants list to CSV
  exportToCSV(participants, eventTitle = 'event') {
    if (!participants || !participants.length) {
      alert('No participant records to export.');
      return;
    }

    const headers = [
      'Ticket ID',
      'Participant Name',
      'Email',
      'Phone',
      'College',
      'Department',
      'Year of Study',
      'Registration Date',
      'Status'
    ];

    const rows = participants.map(p => [
      `"${p.ticketId || ''}"`,
      `"${p.participantName || ''}"`,
      `"${p.participantEmail || ''}"`,
      `"${p.participantPhone || ''}"`,
      `"${p.college || ''}"`,
      `"${p.department || ''}"`,
      `"${p.yearOfStudy || ''}"`,
      `"${p.registeredAt ? new Date(p.registeredAt).toLocaleDateString() : ''}"`,
      `"${p.status || 'confirmed'}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const sanitizedTitle = eventTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
    link.setAttribute('href', url);
    link.setAttribute('download', `${sanitizedTitle}_participants.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
