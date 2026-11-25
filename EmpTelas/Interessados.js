// @ts-nocheck
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { listenJobApplications } from '../services/applications';
import { ensureConversation } from '../services/chat';
import { auth } from '../services/firebase';
import { obterPerfilBasico } from '../services/perfis';
import { irParaAba } from '../utils/navegacao';

export default function Interessados({ route, navigation }) {
  const { jobId, vagaTitulo } = route.params;
  const companyId = route.params.companyId ?? auth.currentUser?.uid;
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet, width);

  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [perfis, setPerfis] = useState({});
  const [abrindo, setAbrindo] = useState(null);

  useEffect(() => {
    const unsubscribe = listenJobApplications(jobId, companyId, (apps) => {
      setCandidatos(apps);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [jobId, companyId]);

  // nome e área atualizados direto do perfil do candidato
  useEffect(() => {
    let ativo = true;
    candidatos.forEach((c) => {
      if (!c.candidateUid) return;
      obterPerfilBasico(c.candidateUid, 'candidate').then((p) => {
        if (ativo) setPerfis((atual) => ({ ...atual, [c.candidateUid]: p }));
      });
    });
    return () => {
      ativo = false;
    };
  }, [candidatos]);

  function nomeDe(c) {
    return perfis[c.candidateUid]?.nome ?? c.candidateNome ?? 'Candidato';
  }

  function areaDe(c) {
    return perfis[c.candidateUid]?.detalhe ?? c.candidateAreaAtuacao ?? 'Área não informada';
  }

  function abrirPerfil(c) {
    navigation.navigate('PerfilPublico', { tipo: 'candidate', id: c.candidateUid });
  }

  async function abrirChat(c) {
    if (!c.candidateUid || !companyId || abrindo) return;
    setAbrindo(c.candidateUid);
    try {
      const conversationId = await ensureConversation(c.candidateUid, companyId);
      navigation.navigate('Conversas', {
        conversationId,
        outroNome: nomeDe(c),
        outroUid: c.candidateUid,
        outroTipo: 'candidate',
      });
    } catch (e) {
      console.log('Erro ao abrir conversa:', e);
      Alert.alert('Ops', 'Não foi possível abrir a conversa agora. Confere a internet e tenta de novo.');
    } finally {
      setAbrindo(null);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>

        <Text style={styles.subTitulo}>Interessados</Text>
        <Text style={styles.vagaNome}>{vagaTitulo}</Text>

        {loading ? (
          <Text style={{ color: '#6D6D6D', marginTop: 20 }}>Carregando...</Text>
        ) : candidatos.length === 0 ? (
          <Text style={{ color: '#6D6D6D', marginTop: 20 }}>
            Ninguém se candidatou a essa vaga ainda.
          </Text>
        ) : (
          candidatos.map((candidato) => (
            <TouchableOpacity
              key={candidato.id}
              style={styles.candidatoRow}
              onPress={() => abrirPerfil(candidato)}
              accessibilityRole="button"
              accessibilityLabel={`Ver perfil de ${nomeDe(candidato)}`}>
              <Image
                source={require('../assets/UserPhotoEX.png')}
                style={styles.avatar}
              />
              <View style={styles.candidatoInfo}>
                <Text style={styles.candidatoNome}>{nomeDe(candidato)}</Text>
                <Text style={styles.candidatoDetalhe}>{areaDe(candidato)}</Text>
                <Text style={styles.compatibilidade}>Compatibilidade: em breve</Text>
              </View>
              <TouchableOpacity
                onPress={() => abrirChat(candidato)}
                disabled={abrindo === candidato.candidateUid}
                hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                accessibilityRole="button"
                accessibilityLabel={`Conversar com ${nomeDe(candidato)}`}>
                <Feather name="message-circle" size={24} color="#00BCD4" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons name="home" size={24 * scale} color="#6f6f6f" onPress={() => irParaAba(navigation, 'inicio', 'company')} />
        <Ionicons name="chatbubble-outline" size={22 * scale} color="#6f6f6f" onPress={() => irParaAba(navigation, 'chat', 'company')} />
        <MaterialCommunityIcons name="briefcase-outline" size={23 * scale} color="#54c3ea" onPress={() => irParaAba(navigation, 'vagas', 'company')} />
        <Ionicons name="notifications-outline" size={23 * scale} color="#6f6f6f" onPress={() => irParaAba(navigation, 'notificacoes', 'company')} />
        <Ionicons name="menu" size={24 * scale} color="#6f6f6f" onPress={() => irParaAba(navigation, 'menu', 'company')} />
      </View>
    </SafeAreaView>
  );
}

function createStyles(scale, isSmallDevice, isTablet, width) {
  const maxContentWidth = isTablet ? 520 : '100%';
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    scrollContent: {
      paddingHorizontal: isSmallDevice ? 16 : 24, paddingTop: 40, paddingBottom: 24,
      maxWidth: maxContentWidth, width: '100%', alignSelf: 'center',
    },
    backButton: { marginBottom: 10 },
    backArrow: { fontSize: 32, color: '#4a4a4a' },
    subTitulo: { color: '#6D6D6D', fontSize: 24, fontWeight: 'bold' },
    vagaNome: { color: '#45c5f3', fontSize: 16, fontWeight: '700', marginBottom: 20 },
    candidatoRow: {
      flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#6D6D6D',
      borderRadius: 15, padding: 12, marginBottom: 12,
    },
    avatar: { width: 44 * scale, height: 44 * scale, borderRadius: 22 * scale },
    candidatoInfo: { flex: 1, marginLeft: 12 },
    candidatoNome: { fontSize: 16, color: '#6D6D6D', fontWeight: 'bold' },
    candidatoDetalhe: { fontSize: 13, color: '#555', marginTop: 2 },
    compatibilidade: { fontSize: 11, color: '#9b9b9b', marginTop: 4, fontStyle: 'italic' },
    bottomNav: {
      flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
      backgroundColor: '#e9e6f2', borderRadius: 30 * scale,
      marginHorizontal: isSmallDevice ? 16 : 24, marginBottom: 20 * scale, paddingVertical: 12 * scale,
    },
  });
}