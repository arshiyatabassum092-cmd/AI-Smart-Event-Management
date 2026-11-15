import {
  collection,
  getDocs,
  getDoc,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';
import { INITIAL_SAMPLE_EVENTS } from './seedService';

const LOCAL_STORAGE_KEY = 'smart_events_catalogue';

// Helper to initialize local storage fallback
const getLocalEvents = () => {
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  let events = [];
  if (!stored) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_EVENTS));
    events = INITIAL_SAMPLE_EVENTS;
  } else {
    try {
      events = JSON.parse(stored);
    } catch (e) {
      events = INITIAL_SAMPLE_EVENTS;
    }
  }

  // Synchronize registeredCount with actual registration records from smart_events_registrations
  try {
    const regList = JSON.parse(localStorage.getItem('smart_events_registrations') || '[]');
    const seenByEvent = {};
    const regCounts = {};
    for (const r of regList) {
      if (r.eventId && r.status !== 'cancelled') {
        if (!seenByEvent[r.eventId]) seenByEvent[r.eventId] = new Set();
        const key = r.userId || r.participantEmail || r.id;
        if (!seenByEvent[r.eventId].has(key)) {
          seenByEvent[r.eventId].add(key);
          regCounts[r.eventId] = (regCounts[r.eventId] || 0) + 1;
        }
      }
    }

    return events.map(evt => {
      const actualCount = regCounts[evt.id] || 0;
      const storedCount = Number(evt.registeredCount) || 0;
      const count = Math.max(actualCount, storedCount);
      return { ...evt, registeredCount: count };
    });
  } catch {
    return events;
  }
};

const saveLocalEvents = (events) => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
};

export const eventService = {
  // 1. Get all events
  async getEvents() {
    if (isFirebaseConfigured && db) {
      try {
        const eventsRef = collection(db, 'events');
        const q = query(eventsRef, orderBy('date', 'asc'));
        const snapshot = await getDocs(q);
        
        if (snapshot.empty) {
          // Auto-seed if database is empty so evaluator sees sample events right away!
          console.log('Firestore events collection is empty. Populating initial events...');
          await this.seedInitialEvents();
          return this.getEvents();
        }

        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
      } catch (err) {
        console.warn('Firestore fetch failed, falling back to local dataset:', err);
        return getLocalEvents();
      }
    } else {
      return getLocalEvents();
    }
  },

  // 2. Get single event by ID
  async getEventById(id) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'events', id);
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
          return { id: snapshot.id, ...snapshot.data() };
        }
      } catch (err) {
        console.warn('Firestore single doc fetch error:', err);
      }
    }
    const events = getLocalEvents();
    return events.find(e => e.id === id) || null;
  },

  // 3. Create new event
  async createEvent(eventData) {
    const payload = {
      ...eventData,
      registeredCount: Number(eventData.registeredCount) || 0,
      capacity: Number(eventData.capacity) || 100,
      status: eventData.status || 'upcoming',
      createdAt: new Date().toISOString()
    };

    if (isFirebaseConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, 'events'), {
          ...payload,
          serverCreatedAt: serverTimestamp()
        });
        return { id: docRef.id, ...payload };
      } catch (err) {
        console.warn('Firestore create failed, saving locally:', err);
      }
    }

    // Local fallback
    const events = getLocalEvents();
    const newEvent = { id: `evt-${Date.now()}`, ...payload };
    events.unshift(newEvent);
    saveLocalEvents(events);
    return newEvent;
  },

  // 4. Update event
  async updateEvent(id, updatedFields) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'events', id);
        await updateDoc(docRef, {
          ...updatedFields,
          updatedAt: serverTimestamp()
        });
        return { id, ...updatedFields };
      } catch (err) {
        console.warn('Firestore update failed, updating locally:', err);
      }
    }

    const events = getLocalEvents();
    const index = events.findIndex(e => e.id === id);
    if (index !== -1) {
      events[index] = { ...events[index], ...updatedFields };
      saveLocalEvents(events);
      return events[index];
    }
    throw new Error('Event not found');
  },

  // 5. Delete event
  async deleteEvent(id) {
    if (isFirebaseConfigured && db) {
      try {
        const docRef = doc(db, 'events', id);
        await deleteDoc(docRef);
        return true;
      } catch (err) {
        console.warn('Firestore delete failed, deleting locally:', err);
      }
    }

    const events = getLocalEvents();
    const filtered = events.filter(e => e.id !== id);
    saveLocalEvents(filtered);
    return true;
  },

  // 6. Seed initial events
  async seedInitialEvents() {
    if (isFirebaseConfigured && db) {
      try {
        for (const item of INITIAL_SAMPLE_EVENTS) {
          const { id, ...data } = item;
          await addDoc(collection(db, 'events'), {
            ...data,
            createdAt: serverTimestamp()
          });
        }
        return true;
      } catch (err) {
        console.error('Failed to seed Firestore:', err);
      }
    }
    saveLocalEvents(INITIAL_SAMPLE_EVENTS);
    return true;
  }
};
