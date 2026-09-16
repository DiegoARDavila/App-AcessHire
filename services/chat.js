import {
    addDoc,
    collection,
    doc,
    getDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    setDoc,
    where,
} from '@react-native-firebase/firestore';
import { db } from './firebase';

function buildConversationId(candidateUid, companyId) {
  return `${candidateUid}_${companyId}`;
}

export async function ensureConversation(candidateUid, companyId) {
  const conversationId = buildConversationId(candidateUid, companyId);
  const ref = doc(db, 'conversations', conversationId);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      participants: [candidateUid, companyId],
      candidateUid,
      companyId,
      lastMessage: null,
      lastMessageAt: serverTimestamp(),
      createdAt: serverTimestamp(),
    });
  }

  return conversationId;
}

export function listenUserConversations(uid, callback) {
  const q = query(
    collection(db, 'conversations'),
    where('participants', 'array-contains', uid)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const convos = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(convos);
    },
    (error) => {
      console.log('Erro no listener de conversas:', error);
      callback([]);
    }
  );
}

export function listenConversationMessages(conversationId, callback) {
  const q = query(
    collection(db, 'conversations', conversationId, 'messages'),
    orderBy('sentAt', 'asc')
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const msgs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(msgs);
    },
    (error) => {
      console.log('Erro no listener de mensagens:', error);
      callback([]);
    }
  );
}

export async function sendMessage(conversationId, senderUid, text) {
  await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
    senderUid,
    text,
    sentAt: serverTimestamp(),
  });

  await setDoc(
    doc(db, 'conversations', conversationId),
    { lastMessage: text, lastMessageAt: serverTimestamp() },
    { merge: true }
  );
}
