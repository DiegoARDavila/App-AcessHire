// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { auth } from '../services/firebase';
import { listenOpenJobs } from '../services/jobs';
import { applyToJob, hasApplied } from '../services/applications';
import { getProfile } from '../services/auth';

export default function VagasUser({ navigation, onSearch }) {
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);

  const styles = createStyles(scale, isSmallDevice, isTablet, width);

  const uid = auth.currentUser?.uid;
  const [vagas, setVagas] = useState([]);
  const [aplicadas, setAplicadas] = useState({});
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [loadingJobId, setLoadingJobId] = useState(null);

  useEffect(() => {
    if (!uid) return;
    getProfile(uid, 'candidate').then((profile) => {
      setVerificationStatus(profile?.verificationStatus ?? 'pending');
    });
  }, [uid]);

  useEffect(() => {
    const unsubscribe = listenOpenJobs(setVagas);
    return () => unsubscribe();
  }, []);

  async function handleCandidatar(vaga) {
    if (verificationStatus !== 'verified') {
      Alert.alert(
        'Conta em verificação',
        'Você poderá se candidatar assim que seu laudo médico for verificado.'
      );
      return;
    }

    setLoadingJobId(vaga.id);
    try {
      await applyToJob({ candidateUid: uid, jobId: vaga.id, companyId: vaga.companyId });
      setAplicadas((prev) => ({ ...prev, [vaga.id]: true }));
      Alert.alert('Candidatura enviada!', `Você se candidatou para ${vaga.titulo}.`);
    } catch (e) {
      if (e.message === 'already-applied') {
        Alert.alert('Você já se candidatou', 'Sua candidatura para essa vaga já foi enviada.');
        setAplicadas((prev) => ({ ...prev, [vaga.id]: true }));
      } else {
        Alert.alert('Erro', 'Não foi possível enviar sua candidatura. Tenta de novo.');
        console.log(e);
      }
    } finally {
      setLoadingJobId(null);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Image
            source={require('../assets/UserPhotoEX.png')}
            style={styles.avatar}
          />
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar"
              placeholderTextColor="#9b9b9b"
              onChangeText={onSearch}
              accessibilityLabel="Campo de pesquisa"
            />
            <Ionicons name="search" size={18 * scale} color="#9b9b9b" />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.filterBar}>
            <TouchableOpacity style={[styles.filterBtn, styles.filterBtnAtivo]}>
              <Text style={{ color: '#fff' }}>Recomendadas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => Alert.alert('Em breve', 'Essa função ainda não está disponível.')}>
              <Text>Salvas</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => Alert.alert('Em breve', 'Essa função ainda não está disponível.')}>
              <Text>Aplicadas</Text>
            </TouchableOpacity>
          </View>

          {verificationStatus === 'pending' && (
            <View style={styles.avisoPendente}>
              <Text style={styles.avisoPendenteTexto}>
                Sua conta ainda está em verificação. Você pode navegar pelas vagas, mas só poderá se candidatar depois que seu laudo for verificado.
              </Text>
            </View>
          )}

          {vagas.length === 0 ? (
            <Text style={{ color: '#6f6f6f', marginTop: 10 }}>Nenhuma vaga disponível no momento.</Text>
          ) : (
            vagas.map((vaga) => (
              <View key={vaga.id} style={styles.vagaCard}>
                <Text style={styles.vagaTitulo}>{vaga.titulo}</Text>
                <Text style={styles.vagaLocal}>Local: {vaga.localTrabalho}</Text>
                <Text style={styles.vagaDescricao} numberOfLines={3}>{vaga.descricao}</Text>

                {vaga.reqAcessibilidade?.length > 0 && (
                  <View style={styles.chipsRow}>
                    {vaga.reqAcessibilidade.map((r) => (
                      <View key={r} style={styles.chip}>
                        <Text style={styles.chipText}>{r}</Text>
                      </View>
                    ))}
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.candidatarBtn,
                    (aplicadas[vaga.id] || verificationStatus !== 'verified') && styles.candidatarBtnDesabilitado,
                  ]}
                  onPress={() => handleCandidatar(vaga)}
                  disabled={loadingJobId === vaga.id || aplicadas[vaga.id]}>
                  {loadingJobId === vaga.id ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.candidatarBtnTexto}>
                      {aplicadas[vaga.id] ? 'Candidatura enviada' : 'Candidatar-se'}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons
          name="home"
          size={24 * scale}
          color="#6f6f6f"
          onPress={() => navigation.navigate('MenuUser')}
        />
        <Ionicons
          name="chatbubble-outline"
          size={22 * scale}
          color="#6f6f6f"
          onPress={() => navigation.navigate('Chat')}
        />
        <MaterialCommunityIcons
          name="briefcase-outline"
          size={23 * scale}
          color="#54c3ea"
        />
        <Ionicons
          name="notifications-outline"
          size={23 * scale}
          color="#6f6f6f"
          onPress={() => navigation.navigate('Notificacoes')}
        />
        <Ionicons
          name="menu"
          size={24 * scale}
          color="#6f6f6f"
          onPress={() => navigation.navigate('ConfigUser')}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(scale, isSmallDevice, isTablet, width) {
  const maxContentWidth = isTablet ? 520 : '100%';

  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    scrollContent: { paddingTop: 40, paddingBottom: 24, maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' },
    topBar: {
      paddingHorizontal: isSmallDevice ? 16 : 24, flexDirection: 'row', alignItems: 'center',
      paddingBottom: 12 * scale, borderBottomWidth: 1, borderBottomColor: '#d1d1d1',
    },
    avatar: { width: 44 * scale, height: 44 * scale, borderRadius: 22 * scale },
    searchBar: {
      flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2',
      borderRadius: 20 * scale, paddingHorizontal: 16 * scale, paddingVertical: 10 * scale, marginLeft: 12 * scale,
    },
    searchInput: { flex: 1, fontSize: 14 * scale, color: '#4a4a4a' },
    content: { paddingHorizontal: isSmallDevice ? 16 : 24 },
    filterBar: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 15, gap: 8 },
    filterBtn: { backgroundColor: '#d1d1d1', padding: 10, borderRadius: 15, flex: 1, alignItems: 'center' },
    filterBtnAtivo: { backgroundColor: '#45c5f3' },
    avisoPendente: { backgroundColor: '#fff3cd', borderRadius: 10, padding: 12, marginBottom: 16 },
    avisoPendenteTexto: { color: '#856404', fontSize: 13 },
    vagaCard: {
      borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 12, padding: 14, marginBottom: 14,
    },
    vagaTitulo: { fontSize: 17, fontWeight: '700', color: '#3a3a3a' },
    vagaLocal: { fontSize: 13, color: '#6f6f6f', marginTop: 2 },
    vagaDescricao: { fontSize: 13, color: '#4a4a4a', marginTop: 8 },
    chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
    chip: { backgroundColor: '#e6f4fe', borderRadius: 14, paddingVertical: 4, paddingHorizontal: 10 },
    chipText: { fontSize: 11, color: '#2c8bc4' },
    candidatarBtn: { backgroundColor: '#45c5f3', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 12 },
    candidatarBtnDesabilitado: { backgroundColor: '#b0b0b0' },
    candidatarBtnTexto: { color: '#fff', fontWeight: '700' },
    bottomNav: {
      flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
      backgroundColor: '#e9e6f2', borderRadius: 30 * scale,
      marginHorizontal: isSmallDevice ? 16 : 24, marginBottom: 20 * scale, paddingVertical: 12 * scale,
    },
  });
}