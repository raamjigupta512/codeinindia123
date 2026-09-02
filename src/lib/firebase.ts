import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  orderBy, 
  limit, 
  getDocFromServer,
  onSnapshot,
  Unsubscribe
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firestore with Database ID (Mandatory for specified multi-database support)
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const firestore = db;

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Validate Firestore Connection on Application Boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore client is offline or initializing.');
    }
    return false;
  }
}

// Authentication Helpers
export async function signInWithGoogle(): Promise<User | null> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error;
  }
}

export async function logOut(): Promise<void> {
  await signOut(auth);
}

// Lead / Registration Firestore Operations
export interface FirestoreLead {
  name: string;
  email: string;
  phone: string;
  track: string;
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'ABANDONED';
  createdAt: string;
}

export async function saveLeadToFirestore(id: string, lead: FirestoreLead): Promise<void> {
  const path = `leads/${id}`;
  try {
    await setDoc(doc(db, 'leads', id), lead, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Payment Firestore Operations
export interface FirestorePayment {
  paymentId: string;
  orderId?: string;
  amount: number;
  currency: string;
  email: string;
  phone?: string;
  name?: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';
  createdAt: string;
}

export async function savePaymentToFirestore(paymentId: string, payment: FirestorePayment): Promise<void> {
  const path = `payments/${paymentId}`;
  try {
    await setDoc(doc(db, 'payments', paymentId), payment, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Curriculum Progress Firestore Operations
export interface FirestoreCurriculumProgress {
  userId: string;
  activeWeek: number;
  completedLessonIds: string[];
  progressPercent: number;
  lastUpdated: string;
}

export async function saveCurriculumProgressToFirestore(
  progressId: string, 
  data: FirestoreCurriculumProgress
): Promise<void> {
  const path = `curriculum_progress/${progressId}`;
  try {
    await setDoc(doc(db, 'curriculum_progress', progressId), data, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getCurriculumProgressFromFirestore(
  progressId: string
): Promise<FirestoreCurriculumProgress | null> {
  const path = `curriculum_progress/${progressId}`;
  try {
    const snap = await getDoc(doc(db, 'curriculum_progress', progressId));
    if (snap.exists()) {
      return snap.data() as FirestoreCurriculumProgress;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeCurriculumProgress(
  progressId: string,
  onUpdate: (data: FirestoreCurriculumProgress | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  return onSnapshot(
    doc(db, 'curriculum_progress', progressId),
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as FirestoreCurriculumProgress);
      } else {
        onUpdate(null);
      }
    },
    (err) => {
      console.warn(`Firestore curriculum progress subscription error on ${progressId}:`, err);
      if (onError) onError(err);
    }
  );
}

// Run connection test once at boot
testFirestoreConnection().catch(() => {});
