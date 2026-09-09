import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export async function signUp({ email, password, role, profileData }) {
  const userCredential = await auth().createUserWithEmailAndPassword(email, password);
  const uid = userCredential.user.uid;

  await firestore().collection('users').doc(uid).set({
    role,
    email,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  const collectionName = role === 'candidate' ? 'candidates' : 'companies';
  await firestore().collection(collectionName).doc(uid).set({
    ...profileData,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  return uid;
}

export async function uploadLaudo(uid, fileUri, fileName) {
  const reference = storage().ref(`verification-documents/${uid}/${fileName}`);
  await reference.putFile(fileUri);
}

export async function signIn({ email, password }) {
  const userCredential = await auth().signInWithEmailAndPassword(email, password);
  return userCredential.user.uid;
}

export async function signOut() {
  await auth().signOut();
}

export async function getUserRole(uid) {
  const doc = await firestore().collection('users').doc(uid).get();
  return doc.exists ? doc.data().role : null;
}