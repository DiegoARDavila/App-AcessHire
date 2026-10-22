import { useEffect, useState } from 'react';
import { auth } from '../services/firebase';
import { getUserRole } from '../services/auth';

const ROTAS = {
  candidate: { home: 'MenuUser', vagas: 'VagasUser', config: 'ConfigUser' },
  company:   { home: 'MenuEmp',  vagas: 'VagasEmp',  config: 'ConfigEmp'  },
};

export function useRotas() {
  const [rotas, setRotas] = useState(null);
  const uid = auth.currentUser?.uid;

  useEffect(() => {
    if (!uid) return;
    getUserRole(uid).then((role) => setRotas(ROTAS[role] ?? null));
  }, [uid]);

  return { rotas, uid };
}