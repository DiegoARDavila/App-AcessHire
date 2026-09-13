import { db } from './firebase';
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
} from '@react-native-firebase/firestore';

export function createJob({ companyId, titulo, descricao, localTrabalho, reqAcessibilidade }) {
  return addDoc(collection(db, 'jobs'), {
    companyId,
    titulo,
    descricao,
    localTrabalho,
    reqAcessibilidade,
    status: 'open',
    dataPublicacao: serverTimestamp(),
  });
}

export function listenCompanyJobs(companyId, callback) {
  if (!companyId) {
    console.log('listenCompanyJobs chamado sem companyId');
    callback([]);
    return () => {};
  }

  const q = query(collection(db, 'jobs'), where('companyId', '==', companyId));
  return onSnapshot(
    q,
    (snapshot) => {
      const jobs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(jobs);
    },
    (error) => {
      console.log('Erro no listener de vagas:', error);
      callback([]);
    }
  );
}

export function listenOpenJobs(callback) {
  const q = query(collection(db, 'jobs'), where('status', '==', 'open'));
  return onSnapshot(
    q,
    (snapshot) => {
      const jobs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(jobs);
    },
    (error) => {
      console.log('Erro no listener de vagas abertas:', error);
      callback([]);
    }
  );
}