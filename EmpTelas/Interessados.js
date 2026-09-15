// @ts-nocheck
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
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

export default function Interessados({ route, navigation }) {
  const { jobId, companyId, vagaTitulo } = route.params;
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet, width);

  const [candidatos, setCandidatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const unsubscribe = listenJobApplications(jobId, companyId, (apps) => {
    setCandidatos(apps);
    setLoading(false);
  });
  return () => unsubscribe();
}, [jobId, companyId]);

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
            <TouchableOpacity key={candidato.id} style={styles.candidatoRow}>
              <Image
                source={require('../assets/UserPhotoEX.png')}
                style={styles.avatar}
              />
              <View style={styles.candidatoInfo}>
                <Text style={styles.candidatoNome}>
                  {candidato.perfil?.nome || 'Candidato'}
                </Text>
                <Text style={styles.candidatoDetalhe}>
                  {candidato.perfil?.areaAtuacao || 'Área não informada'}
                </Text>
                <Text style={styles.compatibilidade}>Compatibilidade: em breve</Text>
              </View>
              <Feather name="message-circle" size={22} color="#00BCD4" />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons name="home" size={24 * scale} color="#6f6f6f" onPress={() => navigation.navigate('MenuEmp', { companyId })} />
        <Ionicons name="chatbubble-outline" size={22 * scale} color="#6f6f6f" onPress={() => navigation.navigate('Chat')} />
        <MaterialCommunityIcons name="briefcase-outline" size={23 * scale} color="#54c3ea" onPress={() => navigation.navigate('VagasEmp', { companyId })} />
        <Ionicons name="notifications-outline" size={23 * scale} color="#6f6f6f" onPress={() => navigation.navigate('Notificacoes')} />
        <Ionicons name="menu" size={24 * scale} color="#6f6f6f" onPress={() => navigation.navigate('ConfigEmp')} />
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