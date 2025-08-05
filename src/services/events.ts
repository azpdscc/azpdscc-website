
/**
 * @fileoverview This file contains functions for interacting with the Events
 * collection in Firebase Firestore. It handles all database operations for events,
 * such as fetching, creating, updating, and deleting.
 */

import { db } from '@/lib/firebase';
import type { Event, EventFormData } from '@/lib/types';
import { events as staticEvents } from '@/lib/static-data'; // Import static data
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy, writeBatch } from 'firebase/firestore';

const eventsCollectionRef = collection(db, 'events');

/**
 * Seeds the Firestore database with initial static event data if it's empty.
 * This function is intended to be run once.
 */
async function seedInitialEvents() {
    const querySnapshot = await getDocs(query(eventsCollectionRef));
    if (querySnapshot.empty) {
        console.log("Events collection is empty. Seeding initial data...");
        const batch = writeBatch(db);
        staticEvents.forEach((event) => {
            // Since we're using static data with predefined IDs, we use `doc` to specify the ID.
            const docRef = doc(db, 'events', event.id);
            batch.set(docRef, {
                slug: event.slug,
                name: event.name,
                date: event.date,
                time: event.time,
                locationName: event.locationName,
                locationAddress: event.locationAddress,
                image: event.image,
                description: event.description,
                fullDescription: event.fullDescription,
                category: event.category
            });
        });
        await batch.commit();
        console.log("Initial events seeded successfully.");
    } else {
        console.log("Events collection already contains data. No seeding needed.");
    }
}


/**
 * Fetches all events from the Firestore database.
 * @returns {Promise<Event[]>} A promise that resolves to an array of events.
 */
export async function getEvents(): Promise<Event[]> {
  try {
    await seedInitialEvents(); // Ensure data exists before fetching
    const q = query(eventsCollectionRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    const events = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event));
    return events;
  } catch (error) {
    console.error("Error fetching events from Firestore:", error);
    // As a fallback, return the static data if Firestore fails.
    return staticEvents;
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
            console.warn(`No event found with id: ${id}. Falling back to static data.`);
            return staticEvents.find(e => e.id === id) || null;
        }

        return { id: docSnap.id, ...docSnap.data() } as Event;
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
            console.warn(`No event found with slug: ${slug}. Falling back to static data.`);
            return staticEvents.find(e => e.slug === slug) || null;
        }
        
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Event;
    } catch (error) {
        console.error("Error fetching event by slug:", error);
        return null;
    }
}


/**
 * Creates a new event in Firestore.
 * @param {Omit<Event, 'id'>} eventData - The data for the new event.
 * @returns {Promise<string | null>} The ID of the newly created document, or null on failure.
 */
export async function createEvent(eventData: Omit<Event, 'id'>): Promise<string | null> {
    try {
        const docRef = await addDoc(eventsCollectionRef, eventData);
        return docRef.id;
    } catch (error) {
        console.error("Error creating event:", error);
        return null;
    }
}


/**
 * Updates an existing event in Firestore.
 * @param {string} id - The ID of the event document to update.
 * @param {Partial<EventFormData>} eventData - An object with the fields to update.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function updateEvent(id: string, eventData: Partial<EventFormData>): Promise<boolean> {
    try {
        const eventDoc = doc(db, 'events', id);
        await updateDoc(eventDoc, eventData);
        return true;
    } catch (error) {
        console.error("Error updating event:", error);
        return false;
    }
}

/**
 * Deletes an event from Firestore.
 * @param {string} id - The ID of the event document to delete.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function deleteEvent(id: string): Promise<boolean> {
    try {
        const eventDoc = doc(db, 'events', id);
        await deleteDoc(eventDoc);
        return true;
    } catch (error) {
        console.error("Error deleting event:", error);
        return false;
    }
}
