import { getApp } from '@react-native-firebase/app';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
} from '@react-native-firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';

const app = getApp();
const auth = getAuth(app);
const db = getFirestore(app);

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