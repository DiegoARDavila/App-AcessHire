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
} from 'react-native';
import {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
} from '@expo/vector-icons';
import { listenCompanyJobs } from '../services/jobs';

const defaultEntrevistas = [
  { id: '1', data: '10/07', empresa: 'Rafael' },
  { id: '2', data: '25/08', empresa: 'Paulo' },
  { id: '3', data: '18/08', empresa: 'Maria' },
  { id: '4', data: '27/08', empresa: 'Marcos' },
];

export default function Menu({
  route,
  navigation,
  entrevistas = defaultEntrevistas,
  onSearch,
}) {
  const { companyId } = route.params;
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);

  const styles = createStyles(scale, isSmallDevice, isTablet, width);

  const [vagas, setVagas] = useState([]);

  useEffect(() => {
    const unsubscribe = listenCompanyJobs(companyId, setVagas);
    return () => unsubscribe();
  }, [companyId]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate('PerfilEmp')}>
            <Image
              source={require('../assets/UserPhotoEX.png')}
              style={styles.avatar}
            />
          </TouchableOpacity>

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

        <View style={styles.cardVagasPublicadas}>
          <TouchableOpacity onPress={() => navigation.navigate('VagasEmp', { companyId })}>
            <Text style={styles.vagasPublicadas}>Vagas publicadas</Text>
          </TouchableOpacity>

          {vagas.length === 0 ? (
            <Text style={{ color: '#6D6D6D', marginTop: 10 }}>
              Nenhuma vaga publicada ainda.
            </Text>
          ) : (
            vagas.slice(0, 3).map((vaga) => (
              <TouchableOpacity
                key={vaga.id}
                onPress={() => navigation.navigate('VagasEmp', { companyId })}
                style={styles.candidatoRow}>
                <View style={styles.candidatoInfo}>
                  <Text style={styles.candidatoNome}>{vaga.titulo}</Text>
                  <Text style={styles.candidatoDetalhe}>{vaga.localTrabalho}</Text>
                </View>
                <Feather name="briefcase" size={22} color="#00BCD4" />
              </TouchableOpacity>
            ))
          )}
        </View>

        <Text style={styles.sectionTitle}>Sua carreira</Text>

        <View style={styles.careerRow}>
          <View style={styles.entrevistasBox}>
            <Text style={styles.entrevistasHeader}>Entrevistas</Text>
            {entrevistas.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.entrevistaRow,
                  index === entrevistas.length - 1 && styles.entrevistaRowLast,
                ]}>
                <Text style={styles.entrevistaText}>
                  {item.data} - {item.empresa}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.sideCards}>
            <View style={styles.badgeCard}>
              <Text>Falta 2% para a conclusão da lei de cotas</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons
          name="home"
          size={24 * scale}
          color="#54c3ea"
          onPress={() => navigation.navigate('MenuEmp', { companyId })}
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
          color="#6f6f6f"
          onPress={() => navigation.navigate('VagasEmp', { companyId })}
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
          onPress={() => navigation.navigate('ConfigEmp')}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(scale, isSmallDevice, isTablet, width) {
  const maxContentWidth = isTablet ? 520 : '100%';

  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    scrollContent: {
      paddingHorizontal: isSmallDevice ? 16 : 24,
      paddingTop: 40,
      paddingBottom: 24,
      maxWidth: maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 * scale },
    avatar: { width: 44 * scale, height: 44 * scale, borderRadius: 22 * scale },
    searchBar: {
      flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2',
      borderRadius: 20 * scale, paddingHorizontal: 16 * scale, paddingVertical: 10 * scale, marginLeft: 12 * scale,
    },
    searchInput: { flex: 1, fontSize: 14 * scale, color: '#4a4a4a' },
    cardVagasPublicadas: {
      width: width * 0.9, alignSelf: 'center', borderRadius: 25, padding: 10, margin: 30,
      borderWidth: 2, borderColor: '#6D6D6D',
    },
    vagasPublicadas: { fontSize: 25, fontWeight: 'bold', fontFamily: 'InterBold' },
    candidatoRow: {
      flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#6D6D6D',
      borderRadius: 15, padding: 10, marginTop: 12,
    },
    candidatoInfo: { flex: 1, marginLeft: 4 },
    candidatoNome: { fontSize: 16, color: '#6D6D6D', fontWeight: 'bold' },
    candidatoDetalhe: { fontSize: 13, color: '#555' },
    sectionTitle: { fontSize: 22 * scale, fontWeight: '800', color: '#3a3a3a', marginBottom: 14 * scale },
    careerRow: { flexDirection: 'row', marginBottom: 20 * scale },
    entrevistasBox: {
      flex: 1.2, borderWidth: 1, borderColor: '#3a3a3a', borderRadius: 12 * scale,
      overflow: 'hidden', marginRight: 10 * scale,
    },
    entrevistasHeader: {
      fontSize: 14 * scale, fontWeight: '700', color: '#3a3a3a',
      paddingVertical: 10 * scale, paddingHorizontal: 12 * scale,
      borderBottomWidth: 1, borderBottomColor: '#3a3a3a', textAlign: 'center',
    },
    entrevistaRow: { paddingVertical: 12 * scale, paddingHorizontal: 12 * scale, borderBottomWidth: 1, borderBottomColor: '#d9d9d9' },
    entrevistaRowLast: { borderBottomWidth: 0 },
    entrevistaText: { fontSize: 12.5 * scale, color: '#4a4a4a', textAlign: 'center' },
    sideCards: { flex: 1, justifyContent: 'space-between' },
    badgeCard: {
      flex: 1, backgroundColor: '#ffff', borderRadius: 14 * scale, padding: 12 * scale,
      justifyContent: 'center', marginBottom: 10 * scale, position: 'relative',
      borderWidth: 1, borderColor: '#45C5F3',
    },
    bottomNav: {
      flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
      backgroundColor: '#e9e6f2', borderRadius: 30 * scale,
      marginHorizontal: isSmallDevice ? 16 : 24, marginBottom: 20 * scale, paddingVertical: 12 * scale,
    },
  });
}