import React from 'react';
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
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

type Mensagem = {
  id: string,
  nome: string,
  quantidade: number,
  avatarUri?: string,
};

type MensagensScreenProps = {
  avatarUri: string,
  mensagens?: Mensagem[],
  onSearch?: (query: string) => void,
};

export default function Notificacoes({
  navigation,
  avatarUri,
  mensagens = [],
  onSearch,
}: MensagensScreenProps) {
  const { width } = useWindowDimensions();

  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);

  const styles = createStyles(scale, isSmallDevice, isTablet);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
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

      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator>
        <Text style={styles.title}>Caixa de Entrada</Text>
        {mensagens.map((item) => (
          <View key={item.id} style={styles.messageCard}>
            {item.avatarUri ? (
              <Image
                source={{ uri: item.avatarUri }}
                style={styles.messageAvatar}
              />
            ) : (
              <View style={styles.messageAvatarPlaceholder}>
                <Ionicons name="person" size={22 * scale} color="#ffffff" />
              </View>
            )}
            <View style={styles.messageTextBlock}>
              <Text style={styles.messageTitle}>
                Novas mensagens: {item.quantidade}
              </Text>
              <Text style={styles.messageSubtitle}>{item.nome}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons 
          name="home" 
          size={24 * scale} 
          color="#6f6f6f" 
          onPress={() => navigation.navigate('MenuUser')}
          />
        <Ionicons 
          name="chatbubble" 
          size={22 * scale} 
          color="#6f6f6f" 
          onPress={() => navigation.navigate('Chat')}
          />
        <MaterialCommunityIcons
          name="briefcase-outline"
          size={23 * scale}
          color="#6f6f6f"
          onPress={() => navigation.navigate('VagasUser')}
        />
        <Ionicons
          name="notifications-outline"
          size={23 * scale}
          color="#54c3ea"

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

function createStyles(
  scale: number,
  isSmallDevice: boolean,
  isTablet: boolean
) {
  const maxContentWidth = isTablet ? 520 : '100%';

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: isSmallDevice ? 16 : 24,
      paddingTop: 40,
      paddingBottom: 12,
      maxWidth: maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    avatar: {
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 22 * scale,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      borderRadius: 20 * scale,
      paddingHorizontal: 16 * scale,
      paddingVertical: 10 * scale,
      marginLeft: 12 * scale,
    },
    searchInput: {
      flex: 1,
      fontSize: 14 * scale,
      color: '#4a4a4a',
    },

    title: {
      color: '#1d1d1d0',
      fontSize: 24 * scale,
      textAlign: 'left',
      left: 10 * scale,
      margin: 10 * scale,
    },

    listContent: {
      paddingHorizontal: isSmallDevice ? 16 : 24,
      paddingBottom: 16,
      maxWidth: maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    messageCard: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#d9d9d9',
      borderRadius: 14 * scale,
      paddingVertical: 10 * scale,
      paddingHorizontal: 12 * scale,
      marginBottom: 10 * scale,
    },
    messageAvatar: {
      width: 40 * scale,
      height: 40 * scale,
      borderRadius: 20 * scale,
    },
    messageAvatarPlaceholder: {
      width: 40 * scale,
      height: 40 * scale,
      borderRadius: 20 * scale,
      backgroundColor: '#c9c9c9',
      justifyContent: 'center',
      alignItems: 'center',
    },
    messageTextBlock: {
      marginLeft: 12 * scale,
      flexShrink: 1,
    },
    messageTitle: {
      fontSize: 13.5 * scale,
      fontWeight: '700',
      color: '#3a3a3a',
    },
    messageSubtitle: {
      marginTop: 2,
      fontSize: 11.5 * scale,
      color: '#9b9b9b',
    },
    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#e9e6f2',
      borderRadius: 30 * scale,
      marginHorizontal: isSmallDevice ? 16 : 24,
      marginBottom: 20 * scale,
      paddingVertical: 12 * scale,
    },
  });
}
