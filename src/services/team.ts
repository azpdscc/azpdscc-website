
/**
 * @fileoverview This file contains functions for interacting with the TeamMembers
 * collection in Firebase Firestore. It handles all database operations for team members.
 */

import { db } from '@/lib/firebase';
import type { TeamMember } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';

const teamCollectionRef = collection(db, 'teamMembers');

/**
 * Fetches all team members from the Firestore database, ordered by name.
 * @returns {Promise<TeamMember[]>} A promise that resolves to an array of team members.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const q = query(teamCollectionRef, orderBy('name'));
    const querySnapshot = await getDocs(q);
    const members = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TeamMember));
    return members;
  } catch (error) {
    console.error("Error fetching team members from Firestore:", error);
    return [];
  }
}

/**
 * Fetches a single team member by their ID from Firestore.
 * @param {string} id - The ID of the team member to fetch.
 * @returns {Promise<TeamMember | null>} A promise that resolves to the team member object or null if not found.
 */
export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
    try {
        const docRef = doc(db, 'teamMembers', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.warn(`No team member found with id: ${id}.`);
            return null;
        }

        return { id: docSnap.id, ...docSnap.data() } as TeamMember;
    } catch (error) {
        console.error("Error fetching team member by id:", error);
        return null;
    }
}

/**
 * Creates a new team member in Firestore.
 * @param {Omit<TeamMember, 'id'>} memberData - The data for the new member.
 * @returns {Promise<string>} The ID of the newly created document.
 */
export async function createTeamMember(memberData: Omit<TeamMember, 'id'>): Promise<string> {
    const docRef = await addDoc(teamCollectionRef, memberData);
    return docRef.id;
}


/**
 * Updates an existing team member in Firestore.
 * @param {string} id - The ID of the member document to update.
 * @param {Partial<Omit<TeamMember, 'id'>>} memberData - An object with the fields to update.
 * @returns {Promise<void>}
 */
export async function updateTeamMember(id: string, memberData: Partial<Omit<TeamMember, 'id'>>): Promise<void> {
    const memberDoc = doc(db, 'teamMembers', id);
    await updateDoc(memberDoc, memberData);
}

/**
 * Deletes a team member from Firestore.
 * @param {string} id - The ID of the member document to delete.
 * @returns {Promise<void>}
 */
export async function deleteTeamMember(id: string): Promise<void> {
    const memberDoc = doc(db, 'teamMembers', id);
    await deleteDoc(memberDoc);
}
