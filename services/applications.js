import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from '@react-native-firebase/firestore';
import { ensureConversation } from './chat';
import { db } from './firebase';
import { createNotification } from './notifications';

function buildApplicationId(candidateUid, jobId) {
  return `${candidateUid}_${jobId}`;
}

export async function hasApplied(candidateUid, jobId) {
  const docSnap = await getDoc(doc(db, 'applications', buildApplicationId(candidateUid, jobId)));
  return docSnap.exists();
}

export async function applyToJob({ candidateUid, jobId, companyId, candidateNome, candidateAreaAtuacao }) {
  const applicationId = buildApplicationId(candidateUid, jobId);
  const docSnap = await getDoc(doc(db, 'applications', applicationId));

  if (docSnap.exists()) {
    throw new Error('already-applied');
  }

  await setDoc(doc(db, 'applications', applicationId), {
    candidateUid,
    jobId,
    companyId,
    status: 'pending',
    candidateNome: candidateNome || null,
    candidateAreaAtuacao: candidateAreaAtuacao || null,
    data: serverTimestamp(),
  });

  await ensureConversation(candidateUid, companyId);

  await createNotification({
  recipientUid: companyId,
  tipo: 'nova_candidatura',
  texto: `Novo candidato se interessou por uma vaga.`,
});
}

export function listenJobApplications(jobId, companyId, callback) {
  const q = query(
    collection(db, 'applications'),
    where('jobId', '==', jobId),
    where('companyId', '==', companyId)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const apps = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(apps);
    },
    (error) => {
      console.log('Erro no listener de candidaturas:', error);
      callback([]);
    }
  );
}