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

type PerfilScreenProps = {
  coverUri: string;
  avatarUri: string;
  nome: string;
  formacao?: string;
  resideEm?: string;
  contatos?: string;
  conexoes?: string;
  portfolio?: string;
  sobre?: string;
  onSearch?: (query: string) => void;
};

export default function PerfilScreen({
  coverUri,
  avatarUri,
  nome,
  formacao,
  resideEm,
  contatos,
  conexoes,
  portfolio,
  sobre,
  onSearch,
}: PerfilScreenProps) {
  const { width } = useWindowDimensions();

  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);

  const styles = createStyles(scale, isSmallDevice, isTablet);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.topBar}>
        <Ionicons name="arrow-back" size={22 * scale} color="#4a4a4a" />
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentInner}>
          <View style={styles.coverWrapper}>
            <View style={styles.coverImageClip}>
              <Image source={require('../assets/bg.jpg')} style={styles.coverImage} />
            </View>
            <View style={styles.avatarWrapper}>
              <Image source={require('../assets/UserPhotoEX.png')} style={styles.avatar} resizeMode="cover" />
            </View>
            <View style={styles.nomeBadge}>
              <Text style={styles.nomeText}>Renato Duarte</Text>
            </View>
            <View style={styles.editarBadge}>
              <Text style={styles.editarText}>Editar</Text>
            </View>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Informações:</Text>
            <Text style={styles.infoLine}>Nome: {nome}</Text>
            <Text style={styles.infoLine}>Formação/especialização: {formacao}</Text>
            <Text style={styles.infoLine}>Reside em: {resideEm}</Text>
            <Text style={styles.infoLine}>Contatos: {contatos}</Text>
            <Text style={styles.infoLine}>Conexões: {conexoes}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Portfólio:</Text>
            <Text style={styles.infoBody}>{portfolio}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Sobre :</Text>
            <Text style={styles.infoBody}>{sobre}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons name="home-outline" size={24 * scale} color="#6f6f6f" />
        <Ionicons name="chatbubble-outline" size={22 * scale} color="#6f6f6f" />
        <MaterialCommunityIcons name="briefcase-outline" size={23 * scale} color="#6f6f6f" />
        <Ionicons name="notifications-outline" size={23 * scale} color="#6f6f6f" />
        <Ionicons name="menu" size={24 * scale} color="#6f6f6f" />
      </View>
    </SafeAreaView>
  );
}

function createStyles(scale: number, isSmallDevice: boolean, isTablet: boolean) {
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
      paddingBottom: 12 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#d1d1d1'
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
    
    scrollContent: {
      paddingBottom: 24,
      paddingTop: 30,
    },
    contentInner: {
      paddingHorizontal: isSmallDevice ? 16 : 24,
      maxWidth: isTablet ? 520 : undefined,
      width: '100%',
      alignSelf: 'center',
    },
    coverWrapper: {
      position: 'relative',
      marginBottom: 40 * scale,
    },
    coverImageClip: {
      borderRadius: 16 * scale,
      overflow: 'hidden',
    },
    coverImage: {
      width: '100%',
      height: 140 * scale,
    },
    avatarWrapper: {
      position: 'absolute',
      left: 12 * scale,
      bottom: -30 * scale,
      width: 76 * scale,
      height: 76 * scale,
      borderRadius: 38 * scale,
      borderWidth: 3,
      borderColor: '#ffffff',
      overflow: 'hidden',
      backgroundColor: '#1f2a44',
    },
    avatar: {
      width: '100%',
      height: '100%',
      left: -0.5 * scale,
      bottom: -0.4 * scale,
      borderRadius: 38 * scale,
    },
    nomeBadge: {
      position: 'absolute',
      left: 100 * scale,
      bottom: -10 * scale,
      backgroundColor: 'rgba(30,30,30,0.75)',
      borderRadius: 8 * scale,
      paddingHorizontal: 12 * scale,
      paddingVertical: 6 * scale,
    },
    nomeText: {
      color: '#ffffff',
      fontSize: 16 * scale,
      fontWeight: '800',
    },
    editarBadge: {
      position: 'absolute',
      right: 12 * scale,
      bottom: -18 * scale,
      backgroundColor: '#54c3ea',
      borderRadius: 14 * scale,
      paddingHorizontal: 16 * scale,
      paddingVertical: 8 * scale,
    },
    editarText: {
      color: '#ffffff',
      fontSize: 13 * scale,
      fontWeight: '700',
    },
    infoCard: {
      backgroundColor: '#54c3ea',
      borderRadius: 14 * scale,
      padding: 16 * scale,
      marginBottom: 14 * scale,
    },
    infoTitle: {
      color: '#ffffff',
      fontSize: 15 * scale,
      fontWeight: '800',
      marginBottom: 8 * scale,
    },
    infoLine: {
      color: '#ffffff',
      fontSize: 12.5 * scale,
      marginBottom: 4 * scale,
    },
    infoBody: {
      color: '#ffffff',
      fontSize: 12.5 * scale,
      lineHeight: 18 * scale,
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