import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import { auth, db } from './firebase';

export async function signUp({ email, password, role, profileData }) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const uid = userCredential.user.uid;

  await setDoc(doc(db, 'users', uid), {
    role,
    email,
    createdAt: serverTimestamp(),
  });

  const collectionName = role === 'candidate' ? 'candidates' : 'companies';
  await setDoc(doc(db, collectionName, uid), {
    ...profileData,
    createdAt: serverTimestamp(),
  });

  return uid;
}

export async function signIn({ email, password }) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user.uid;
}

export async function signOut() {
  await firebaseSignOut(auth);
}

export async function getUserRole(uid) {
  const docSnap = await getDoc(doc(db, 'users', uid));
  return docSnap.exists() ? docSnap.data().role : null;
}

export async function completeProfile(uid, role, data) {
  const collectionName = role === 'candidate' ? 'candidates' : 'companies';
  await setDoc(doc(db, collectionName, uid), { ...data, profileCompleted: true }, { merge: true });
}

export async function getProfile(uid, role) {
  const collectionName = role === 'candidate' ? 'candidates' : 'companies';
  const docSnap = await getDoc(doc(db, collectionName, uid));
  return docSnap.exists() ? docSnap.data() : null;
}