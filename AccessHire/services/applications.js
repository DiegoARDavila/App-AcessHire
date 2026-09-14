import { db } from './firebase';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from '@react-native-firebase/firestore';

export async function hasApplied(candidateUid, jobId) {
  const q = query(
    collection(db, 'applications'),
    where('candidateUid', '==', candidateUid),
    where('jobId', '==', jobId)
  );
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export async function applyToJob({ candidateUid, jobId, companyId }) {
  const jaAplicou = await hasApplied(candidateUid, jobId);
  if (jaAplicou) {
    throw new Error('already-applied');
  }

  return addDoc(collection(db, 'applications'), {
    candidateUid,
    jobId,
    companyId,
    status: 'pending',
    data: serverTimestamp(),
  });
}