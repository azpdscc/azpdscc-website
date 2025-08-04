/**
 * @fileoverview This file contains functions for interacting with the Events
 * collection in Firebase Firestore. It handles all database operations for events,
 * such as fetching, creating, updating, and deleting.
 */

import { db } from '@/lib/firebase';
import type { Event } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';

const eventsCollectionRef = collection(db, 'events');

/**
 * Fetches all events from the Firestore database, ordered by date descending.
 * @returns {Promise<Event[]>} A promise that resolves to an array of events.
 */
export async function getEvents(): Promise<Event[]> {
  try {
    const q = query(eventsCollectionRef, orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Event));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

/**
 * Fetches a single event by its slug from Firestore.
 * @param {string} slug - The slug of the event to fetch.
 * @returns {Promise<Event | null>} A promise that resolves to the event object or null if not found.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
    try {
        const q = query(eventsCollectionRef, where("slug", "==", slug));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            console.log(`No event found with slug: ${slug}`);
            return null;
        }

        const docSnap = querySnapshot.docs[0];
        return { id: docSnap.id, ...docSnap.data() } as Event;

    } catch (error) {
        console.error("Error fetching event by slug:", error);
        return null;
    }
}

/**
 * Creates a new event in Firestore.
 * @param {Omit<Event, 'id'>} eventData - The data for the new event, without an id.
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
 * @param {Partial<Event>} eventData - An object with the fields to update.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function updateEvent(id: string, eventData: Partial<Event>): Promise<boolean> {
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
