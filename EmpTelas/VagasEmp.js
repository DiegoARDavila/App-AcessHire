import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { deleteJob, listenCompanyJobs } from '../services/jobs';

export default function VagasEmp({ route, navigation, onSearch }) {
  const { companyId } = route.params;
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet, width);

  const [vagas, setVagas] = useState([]);

  useEffect(() => {
    const unsubscribe = listenCompanyJobs(companyId, setVagas);
    return () => unsubscribe();
  }, [companyId]);

  function handleExcluir(jobId) {
    Alert.alert('Excluir vaga', 'Tem certeza que deseja excluir essa vaga?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => deleteJob(jobId) },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.navigate('PerfilEmp')}>
            <Image source={require('../assets/UserPhotoEX.png')} style={styles.avatar} />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar"
              placeholderTextColor="#9b9b9b"
              onChangeText={onSearch}
            />
            <Ionicons name="search" size={18 * scale} color="#9b9b9b" />
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.subTitulo}>Vagas Lançadas</Text>

          {vagas.length === 0 ? (
            <Text style={{ color: '#6D6D6D' }}>Nenhuma vaga publicada ainda.</Text>
          ) : (
            vagas.map((vaga) => (
              <View key={vaga.id} style={styles.vaga}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.tituloVaga}>{vaga.titulo}</Text>
                  <Text style={styles.legendaEscura}>Local: {vaga.localTrabalho}</Text>
                  <View style={styles.buttomLine}>
                    <TouchableOpacity
                      style={styles.botoesSelecionado}
                      onPress={() => navigation.navigate('Interessados', { jobId: vaga.id, companyId, vagaTitulo: vaga.titulo })}>
                      <Text style={styles.legenda}>Ver Interessados</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.botoesEdicao} onPress={() => handleExcluir(vaga.id)}>
                      <Text style={styles.legenda}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}

          <TouchableOpacity
            style={[styles.botoesSelecionado, { marginTop: 20, alignSelf: 'flex-start' }]}
            onPress={() => navigation.navigate('AdicionarVagas', { companyId })}>
            <Text style={styles.legenda}>+ Adicionar Vaga</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons name="home" size={24 * scale} color="#6f6f6f" onPress={() => navigation.navigate('MenuEmp')} />
        <Ionicons name="chatbubble-outline" size={22 * scale} color="#6f6f6f" onPress={() => navigation.navigate('Chat')} />
        <MaterialCommunityIcons name="briefcase-outline" size={23 * scale} color="#54c3ea" onPress={() => navigation.navigate('VagasEmp', { companyId })} />
        <Ionicons name="notifications-outline" size={23 * scale} color="#6f6f6f" onPress={() => navigation.navigate('Notificacoes')} />
        <Ionicons name="menu" size={24 * scale} color="#6f6f6f" onPress={() => navigation.navigate('ConfigUser')} />
      </View>
    </SafeAreaView>
  );
}

function createStyles(scale, isSmallDevice, isTablet, width) {
  const maxContentWidth = isTablet ? 520 : '100%';
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    scrollContent: { paddingTop: 40, paddingBottom: 24, maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' },
    topBar: { paddingHorizontal: isSmallDevice ? 16 : 24, flexDirection: 'row', alignItems: 'center', paddingBottom: 12 * scale, borderBottomWidth: 1, borderBottomColor: '#d1d1d1' },
    avatar: { width: 44 * scale, height: 44 * scale, borderRadius: 22 * scale },
    searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2', borderRadius: 20 * scale, paddingHorizontal: 16 * scale, paddingVertical: 10 * scale, marginLeft: 12 * scale },
    searchInput: { flex: 1, fontSize: 14 * scale, color: '#4a4a4a' },
    content: { padding: isSmallDevice ? 16 : 24 },
    bottomNav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: '#e9e6f2', borderRadius: 30 * scale, marginHorizontal: isSmallDevice ? 16 : 24, marginBottom: 20 * scale, paddingVertical: 12 * scale },
    vaga: { backgroundColor: '#8C8C8C', borderRadius: 10, flexDirection: 'row', alignItems: 'center', padding: 12, marginBottom: 15 },
    tituloVaga: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
    legendaEscura: { color: '#e0e0e0', fontSize: 13, marginTop: 4 },
    subTitulo: { color: '#6D6D6D', fontSize: 24, fontWeight: 'bold', marginBottom: 17 },
    buttomLine: { flexDirection: 'row', gap: 16, marginTop: 10 },
    botoesEdicao: { backgroundColor: '#6D6D6D', borderRadius: 12, padding: 10 },
    botoesSelecionado: { backgroundColor: '#45C5F3', borderRadius: 12, padding: 10 },
    legenda: { color: '#FFFFFF', fontSize: 13 },
  });
}