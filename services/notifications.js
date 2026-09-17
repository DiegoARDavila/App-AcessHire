import {
    addDoc,
    collection,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    where,
} from '@react-native-firebase/firestore';
import { db } from './firebase';

export async function createNotification({ recipientUid, tipo, texto }) {
  await addDoc(collection(db, 'notifications'), {
    recipientUid,
    tipo,
    texto,
    lida: false,
    data: serverTimestamp(),
  });
}

export function listenUserNotifications(uid, callback) {
  const q = query(
    collection(db, 'notifications'),
    where('recipientUid', '==', uid),
    orderBy('data', 'desc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const notifs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(notifs);
    },
    (error) => {
      console.log('Erro no listener de notificações:', error);
      callback([]);
    }
  );
}