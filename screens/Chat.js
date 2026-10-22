import {
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
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
import { useRotas } from '../hooks/useRotas';
import { listenUserConversations } from '../services/chat';

export default function Chat({ navigation, onSearch }) {
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);

  const styles = createStyles(scale, isSmallDevice, isTablet, width);

  const { rotas, uid } = useRotas();
  const ir = (chave) => rotas && navigation.navigate(rotas[chave], { companyId: uid });

  const [conversas, setConversas] = useState([]);

  useEffect(() => {
    if (!uid) return;
    const unsubscribe = listenUserConversations(uid, setConversas);
    return () => unsubscribe();
  }, [uid]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Ionicons
            name="arrow-back"
            size={22 * scale}
            color="#4a4a4a"
            style={styles.backIcon}
            onPress={() => navigation.goBack()}
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

        <View style={styles.conversasContainer}>
          {conversas.length === 0 ? (
            <Text style={{ color: '#6D6D6D', marginTop: 20, textAlign: 'center' }}>
              Nenhuma conversa ainda.
            </Text>
          ) : (
            conversas.map((conversa) => (
              <TouchableOpacity
                key={conversa.id}
                style={styles.chat}
                onPress={() =>
                  navigation.navigate('Conversas', {
                    conversationId: conversa.id,
                    outroNome: conversa.candidateUid === uid ? 'Empresa' : 'Candidato',
                  })
                }>
                <Image
                  source={require('../assets/UserPhotoEX.png')}
                  style={styles.fotoChat}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.chatText}>
                    {conversa.candidateUid === uid ? 'Empresa' : 'Candidato'}
                  </Text>
                  <Text style={styles.ultimaMensagem} numberOfLines={1}>
                    {conversa.lastMessage || 'Nova conversa'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons name="home" size={24 * scale} color="#6f6f6f" onPress={() => ir('home')} />
        <Ionicons name="chatbubble-outline" size={22 * scale} color="#54c3ea" />
        <MaterialCommunityIcons name="briefcase-outline" size={23 * scale} color="#6f6f6f" onPress={() => ir('vagas')} />
        <Ionicons name="notifications-outline" size={23 * scale} color="#6f6f6f" onPress={() => navigation.navigate('Notificacoes')} />
        <Ionicons name="menu" size={24 * scale} color="#6f6f6f" onPress={() => ir('config')} />
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
      paddingBottom: 12 * scale, borderBottomWidth: 1, borderBottomColor: '#d1d1d1', gap: 10,
    },
    searchBar: {
      flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2',
      borderRadius: 20 * scale, paddingHorizontal: 16 * scale, paddingVertical: 10 * scale, marginLeft: 12 * scale,
    },
    searchInput: { flex: 1, fontSize: 14 * scale, color: '#4a4a4a' },
    bottomNav: {
      flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
      backgroundColor: '#e9e6f2', borderRadius: 30 * scale,
      marginHorizontal: isSmallDevice ? 16 : 24, marginBottom: 20 * scale, paddingVertical: 12 * scale,
    },
    conversasContainer: { paddingHorizontal: isSmallDevice ? 16 : 24 },
    chatText: { fontSize: 18, color: '#6D6D6D', fontWeight: '700' },
    ultimaMensagem: { fontSize: 13, color: '#9b9b9b', marginTop: 2 },
    chat: {
      flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderColor: '#e0e0e0',
      paddingVertical: 12, gap: 14,
    },
    fotoChat: { width: 44 * scale, height: 44 * scale, borderRadius: 22 * scale },
  });
}