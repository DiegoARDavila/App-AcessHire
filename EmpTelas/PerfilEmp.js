// @ts-nocheck
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    useWindowDimensions,
    View,
} from 'react-native';
import { getProfile } from '../services/auth';
import { auth } from '../services/firebase';

export default function PerfilEmp({ navigation, onSearch }) {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet);

  const uid = auth.currentUser?.uid;
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    if (!uid) return;
    getProfile(uid, 'company').then(setPerfil);
  }, [uid]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.topBar}>
        <Ionicons name="arrow-back" size={22 * scale} color="#4a4a4a" onPress={() => navigation.goBack()} />
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

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.contentInner}>
          <View style={styles.coverWrapper}>
            <View style={styles.coverImageClip}>
              <Image source={require('../assets/bg.jpg')} style={styles.coverImage} />
            </View>
            <View style={styles.avatarWrapper}>
              <Image source={require('../assets/UserPhotoEX.png')} style={styles.avatar} resizeMode="cover" />
            </View>
            <View style={styles.nomeBadge}>
              <Text style={styles.nomeText}>{perfil?.nomeEmpresa || 'Carregando...'}</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Informações:</Text>
            <Text style={styles.infoLine}>Nome: {perfil?.nomeEmpresa || '-'}</Text>
            <Text style={styles.infoLine}>Setor: {perfil?.setor || 'Não informado'}</Text>
            <Text style={styles.infoLine}>Porte: {perfil?.porte || 'Não informado'}</Text>
            <Text style={styles.infoLine}>Sede: {perfil?.sede || '-'}</Text>
            {perfil?.site && <Text style={styles.infoLine}>Site: {perfil.site}</Text>}
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Sobre:</Text>
            <Text style={styles.infoBody}>{perfil?.descricao || 'Nenhuma descrição adicionada ainda.'}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons name="home" size={24 * scale} color="#6f6f6f" onPress={() => navigation.navigate('MenuEmp')} />
        <Ionicons name="chatbubble-outline" size={22 * scale} color="#6f6f6f" onPress={() => navigation.navigate('Chat')} />
        <MaterialCommunityIcons name="briefcase-outline" size={23 * scale} color="#6f6f6f" onPress={() => navigation.navigate('VagasEmp')} />
        <Ionicons name="notifications-outline" size={23 * scale} color="#6f6f6f" onPress={() => navigation.navigate('Notificacoes')} />
        <Ionicons name="menu" size={24 * scale} color="#6f6f6f" onPress={() => navigation.navigate('ConfigEmp')} />
      </View>
    </SafeAreaView>
  );
}

function createStyles(scale, isSmallDevice, isTablet) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    topBar: {
      flexDirection: 'row', alignItems: 'center', paddingHorizontal: isSmallDevice ? 16 : 24,
      paddingTop: 40, paddingBottom: 12 * scale, borderBottomWidth: 1, borderBottomColor: '#d1d1d1',
    },
    searchBar: {
      flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2',
      borderRadius: 20 * scale, paddingHorizontal: 16 * scale, paddingVertical: 10 * scale, marginLeft: 12 * scale,
    },
    searchInput: { flex: 1, fontSize: 14 * scale, color: '#4a4a4a' },
    scrollContent: { paddingBottom: 24, paddingTop: 30 },
    contentInner: {
      paddingHorizontal: isSmallDevice ? 16 : 24, maxWidth: isTablet ? 520 : undefined,
      width: '100%', alignSelf: 'center',
    },
    coverWrapper: { position: 'relative', marginBottom: 40 * scale },
    coverImageClip: { borderRadius: 16 * scale, overflow: 'hidden' },
    coverImage: { width: '100%', height: 140 * scale },
    avatarWrapper: {
      position: 'absolute', left: 12 * scale, bottom: -30 * scale, width: 76 * scale, height: 76 * scale,
      borderRadius: 38 * scale, borderWidth: 3, borderColor: '#ffffff', overflow: 'hidden', backgroundColor: '#1f2a44',
    },
    avatar: { width: '100%', height: '100%', borderRadius: 38 * scale },
    nomeBadge: {
      position: 'absolute', left: 100 * scale, bottom: -10 * scale, backgroundColor: 'rgba(30,30,30,0.75)',
      borderRadius: 8 * scale, paddingHorizontal: 12 * scale, paddingVertical: 6 * scale,
    },
    nomeText: { color: '#ffffff', fontSize: 16 * scale, fontWeight: '800' },
    infoCard: { backgroundColor: '#00C3D0', borderRadius: 14 * scale, padding: 16 * scale, marginBottom: 14 * scale },
    infoTitle: { color: '#ffffff', fontSize: 15 * scale, fontWeight: '800', marginBottom: 8 * scale },
    infoLine: { color: '#ffffff', fontSize: 12.5 * scale, marginBottom: 4 * scale },
    infoBody: { color: '#ffffff', fontSize: 12.5 * scale, lineHeight: 18 * scale },
    bottomNav: {
      flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
      backgroundColor: '#e9e6f2', borderRadius: 30 * scale,
      marginHorizontal: isSmallDevice ? 16 : 24, marginBottom: 20 * scale, paddingVertical: 12 * scale,
    },
  });
}