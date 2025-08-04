
/**
 * @fileoverview This file contains functions for interacting with the TeamMembers
 * collection in Firebase Firestore. It handles all database operations for team members.
 */

import { db } from '@/lib/firebase';
import type { TeamMember } from '@/lib/types';
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, orderBy } from 'firebase/firestore';

const teamCollectionRef = collection(db, 'teamMembers');

/**
 * Fetches all team members from the Firestore database, ordered by name.
 * @returns {Promise<TeamMember[]>} A promise that resolves to an array of team members.
 */
export async function getTeamMembers(): Promise<TeamMember[]> {
  try {
    const q = query(teamCollectionRef, orderBy('name', 'asc'));
    const querySnapshot = await getDocs(q);
    const members = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as TeamMember));
    return members;
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

/**
 * Fetches a single team member by their ID from Firestore.
 * @param {string} id - The ID of the team member document to fetch.
 * @returns {Promise<TeamMember | null>} A promise that resolves to the team member object or null if not found.
 */
export async function getTeamMemberById(id: string): Promise<TeamMember | null> {
    try {
        const docRef = doc(db, 'teamMembers', id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log(`No team member found with id: ${id}`);
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
 * @returns {Promise<string | null>} The ID of the newly created document, or null on failure.
 */
export async function createTeamMember(memberData: Omit<TeamMember, 'id'>): Promise<string | null> {
    try {
        const docRef = await addDoc(teamCollectionRef, memberData);
        return docRef.id;
    } catch (error) {
        console.error("Error creating team member:", error);
        return null;
    }
}


/**
 * Updates an existing team member in Firestore.
 * @param {string} id - The ID of the team member document to update.
 * @param {Partial<Omit<TeamMember, 'id'>>} memberData - An object with the fields to update.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function updateTeamMember(id: string, memberData: Partial<Omit<TeamMember, 'id'>>): Promise<boolean> {
    try {
        const memberDoc = doc(db, 'teamMembers', id);
        await updateDoc(memberDoc, memberData);
        return true;
    } catch (error) {
        console.error("Error updating team member:", error);
        return false;
    }
}

/**
 * Deletes a team member from Firestore.
 * @param {string} id - The ID of the team member document to delete.
 * @returns {Promise<boolean>} True on success, false on failure.
 */
export async function deleteTeamMember(id: string): Promise<boolean> {
    try {
        const memberDoc = doc(db, 'teamMembers', id);
        await deleteDoc(memberDoc);
        return true;
    } catch (error) {
        console.error("Error deleting team member:", error);
        return false;
    }
}
