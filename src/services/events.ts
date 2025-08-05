
/**
 * @fileoverview This file contains functions for interacting with the Events
 * collection in Firebase Firestore. It handles all database operations for events,
 * such as fetching, creating, updating, and deleting.
 */

import { db } from '@/lib/firebase';
import type { Event, EventFormData } from '@/lib/types';
import { events as staticEvents } from '@/lib/data'; // Import static data
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, orderBy, writeBatch } from 'firebase/firestore';

const eventsCollectionRef = collection(db, 'events');

/**
 * Fetches all events from the static data file.
 * This is the primary source of truth for events now.
 * @returns {Promise<Event[]>} A promise that resolves to an array of events.
 */
export async function getEvents(): Promise<Event[]> {
  try {
    // Adding a short delay to simulate network latency if needed
    // await new Promise(resolve => setTimeout(resolve, 50));
    return staticEvents;
  } catch (error) {
    console.error("Error fetching static events:", error);
    return [];
  }
}

/**
 * Fetches a single event by its ID from the static data.
 * @param {string} id - The ID of the event to fetch.
 * @returns {Promise<Event | null>} A promise that resolves to the event object or null if not found.
 */
export async function getEventById(id: string): Promise<Event | null> {
    try {
        const event = staticEvents.find(e => e.id === id) || null;
        if (!event) {
             console.log(`No event found with id: ${id}`);
        }
        return event;
    } catch (error) {
        console.error("Error fetching event by id:", error);
        return null;
    }
}


/**
 * Fetches a single event by its slug from the static data.
 * @param {string} slug - The slug of the event to fetch.
 * @returns {Promise<Event | null>} A promise that resolves to the event object or null if not found.
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
    try {
        const event = staticEvents.find(e => e.slug === slug) || null;
        if (!event) {
            console.log(`No event found with slug: ${slug}`);
        }
        return event;
    } catch (error) {
        console.error("Error fetching event by slug:", error);
        return null;
    }
}

/**
 * Updates an existing event in Firestore.
 * NOTE: This is kept for potential future use or for fields that might be dynamic.
 * For now, core event data is static.
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
 * NOTE: This will only affect the database, not the static file.
 * This should be used with caution.
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
