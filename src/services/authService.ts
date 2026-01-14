import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../../types';
import { getApiUrl } from '../utils/api';

// Sign up new user
export const signUp = async (
  email: string,
  password: string,
  displayName: string,
  additionalData: Partial<User>
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  // Update display name
  await updateProfile(userCredential.user, { displayName });
  
  // Save additional user data to MongoDB via API
  const userData: User = {
    email: userCredential.user.email || email,
    name: displayName,
    firstName: additionalData.firstName,
    lastName: additionalData.lastName,
    middleInitial: additionalData.middleInitial,
    college: additionalData.college,
    contactNumber: additionalData.contactNumber,
    role: email.toLowerCase().includes('admin') ? 'admin' : 'faculty'
  };
  
  // Save to MongoDB
  await saveUserToDatabase(userCredential.user.uid, userData);
  
  return userData;
};

// Sign in existing user
export const signIn = async (email: string, password: string): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  // Fetch user data from MongoDB
  const userData = await getUserFromDatabase(userCredential.user.uid);
  
  if (!userData) {
    // Fallback if user data not found in DB
    return {
      email: userCredential.user.email || email,
      name: userCredential.user.displayName || 'User',
      role: email.toLowerCase().includes('admin') ? 'admin' : 'faculty'
    };
  }
  
  return userData;
};

// Sign out user
export const logOut = async (): Promise<void> => {
  await signOut(auth);
};

// Send password reset email
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};

// Listen to auth state changes
export const onAuthChange = (callback: (user: FirebaseUser | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Get current user
export const getCurrentUser = (): FirebaseUser | null => {
  return auth.currentUser;
};

// --- MongoDB API Calls ---

// Save user to MongoDB
const saveUserToDatabase = async (uid: string, userData: User): Promise<void> => {
  try {
    const API_BASE_URL = getApiUrl();
    await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid, ...userData })
    });
  } catch (error) {
    console.error('Error saving user to database:', error);
  }
};

// Get user from MongoDB
const getUserFromDatabase = async (uid: string): Promise<User | null> => {
  try {
    const API_BASE_URL = getApiUrl();
    const response = await fetch(`${API_BASE_URL}/users/${uid}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching user from database:', error);
    return null;
  }
};
