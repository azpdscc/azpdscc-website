
/**
 * @fileoverview This file contains functions for interacting with the Events
 * collection in Firebase Firestore. It handles all database operations for events,
 * such as fetching, creating, updating, and deleting.
 */

import { db } from '@/lib/firebase';
import type { Event, EventFormData } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { format } from 'date-fns';

const eventsCollectionRef = collection(db, 'events');

/**
 * Fetches all events from the Firestore database, ordered by date descending.
 * @returns {Promise<Event[]>} A promise that resolves to an array of events.
 */
export async function getEvents(): Promise<Event[]> {
  try {
    const q = query(eventsCollectionRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const date = data.date instanceof Timestamp ? format(data.date.toDate(), 'MMMM dd, yyyy') : data.date;
      return {
        id: doc.id,
        ...data,
        date: date
      } as Event;
    });
    return events;
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    return [];
  }
}

/**
 * Fetches a single event by its ID from Firestore.
 * @param {string} id - The ID of the event to fetch.
 * @returns {Promise<Event | null>} A promise that resolves to the event object or null if not found.
 */
export async function getEventById(id: string): Promise<Event | null> {
    try {
        const docRef = doc(db, 'events', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.warn(`No event found with id: ${id}.`);
            return null;
        }
        
        const data = docSnap.data();
        const date = data.date instanceof Timestamp ? format(data.date.toDate(), 'MMMM dd, yyyy') : data.date;
        
        return { id: docSnap.id, ...data, date } as Event;
    } catch (error) {
        console.error("Error fetching event by id:", error);
        return null;
    }
}

/**
 * Fetches a single event by its slug from Firestore.
 * @param {string} slug - The slug of the event to fetch.
 * @returns {Promise<Event | null>} A promise that resolves to the event object or null if not found.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
    try {
        const q = query(eventsCollectionRef, where('slug', '==', slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.warn(`No event found with slug: ${slug}.`);
            return null;
        }
        
        const docSnap = querySnapshot.docs[0];
        const data = docSnap.data();
        const date = data.date instanceof Timestamp ? format(data.date.toDate(), 'MMMM dd, yyyy') : data.date;

        return { id: docSnap.id, ...data, date } as Event;
    } catch (error) {
        console.error("Error fetching event by slug:", error);
        return null;
    }
}


/**
 * Creates a new event in Firestore.
 * @param {EventFormData} eventData - The data for the new event.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createEvent(eventData: EventFormData): Promise<string> {
    const dataToSave = {
        ...eventData,
        date: format(eventData.date, 'MMMM dd, yyyy')
    };
    const docRef = await addDoc(eventsCollectionRef, dataToSave);
    return docRef.id;
}


/**
 * Updates an existing event in Firestore.
 * @param {string} id - The ID of the event document to update.
 * @param {Partial<EventFormData>} eventData - An object with the fields to update.
 * @returns {Promise<void>}
 */
export async function updateEvent(id: string, eventData: Partial<EventFormData>): Promise<void> {
    const dataToSave = {
        ...eventData,
        date: format(eventData.date, 'MMMM dd, yyyy')
    };
    const eventDoc = doc(db, 'events', id);
    await updateDoc(eventDoc, dataToSave);
}

/**
 * Deletes an event from Firestore.
 * @param {string} id - The ID of the event document to delete.
 * @returns {Promise<void>}
 */
export async function deleteEvent(id: string): Promise<void> {
    const eventDoc = doc(db, 'events', id);
    await deleteDoc(eventDoc);
}
