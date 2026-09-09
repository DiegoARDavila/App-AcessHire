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
  TouchableOpacity,
} from 'react-native';
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

type Entrevista = {
  id: string,
  data: string,
  empresa: string,
};

type Contato = {
  id: string,
  avatarUri: string,
};

type HomeScreenProps = {
  entrevistas?: Entrevista[],
  contatos?: Contato[],
  totalContatos?: number,
  onSearch?: (query: string) => void,
};

const defaultEntrevistas: Entrevista[] = [
  { id: '1', data: '10/07', empresa: 'Rafael' },
  { id: '2', data: '25/08', empresa: 'Paulo' },
  { id: '3', data: '18/08', empresa: 'Maria' },
  { id: '4', data: '27/08', empresa: 'Marcos' },
];

export default function Menu({
  navigation,
  entrevistas = defaultEntrevistas,
  contatos = [],
  totalContatos,
  onSearch,
}: HomeScreenProps) {
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);

  const styles = createStyles(scale, isSmallDevice, isTablet, width);

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

        <View style={styles.cardVagasPublicadas}>
        <View> 
        <Text style={styles.vagasPublicadas}>Vagas publicadas</Text>
        </View>
          <TouchableOpacity
            onPress={() => navigation.navigate('VagasPublicadas')}
            style={styles.button}>
            <View>
              <Text style={styles.cadidato}>Candidato 1</Text>
              <Text>25 anos</Text>
              <Text>Desenvolvedor Web</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('VagasPublicadas')}
            style={styles.button}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cadidato}>Candidato 2</Text>
              <Text>22 anos</Text>
              <Text>Desenvolvedor Mobile</Text>
            </View>
          </TouchableOpacity>

          
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
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons 
          name="home" 
          size={24 * scale} 
          color="#54c3ea"   
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
          onPress={() => navigation.navigate('VagasUser')}
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

function createStyles(
  scale: number,
  isSmallDevice: boolean,
  isTablet: boolean,
  width: number
) {
  const maxContentWidth = isTablet ? 520 : '100%';

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    scrollContent: {
      paddingHorizontal: isSmallDevice ? 16 : 24,
      paddingTop: 40,
      paddingBottom: 24,
      maxWidth: maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16 * scale,
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

    cardVagasPublicadas: {
      width: width * 0.9,
      alignSelf: 'center',
      borderRadius: 25,
      padding: 10,
      margin: 30,
      borderWidth:2,
      borderColor:'black',
    },

    vagasPublicadas:{
      fontSize: 25,
      fontWeight: 'bold',
      fontFamily: 'InterBold'
    },

    cadidato:{
      fontSize: 20,
      color:'6D6D6D',
      fontFamily: 'InterBold',
      fontWeight: 'semi-bold'
    },

    cardTitle: {
      color: '#fff',
      fontSize: width * 0.1,
      fontFamily: 'InterBold',
      width: width * 0.4,
    },

    cardSub: {
      color: '#e9f0ff',
      fontSize: width * 0.05,
      marginTop: 10,
      fontFamily: 'Inter',
    },

    cardImage: {
      width: width * 0.4,
      height: width * 0.4,
      position: 'absolute',
      right: width * -0.35,
      top: width * -0.17,
    },
    sectionTitle: {
      fontSize: 22 * scale,
      fontWeight: '800',
      color: '#3a3a3a',
      marginBottom: 14 * scale,
    },
    careerRow: {
      flexDirection: 'row',
      marginBottom: 20 * scale,
    },
    entrevistasBox: {
      flex: 1.2,
      borderWidth: 1,
      borderColor: '#3a3a3a',
      borderRadius: 12 * scale,
      overflow: 'hidden',
      marginRight: 10 * scale,
    },
    entrevistasHeader: {
      fontSize: 14 * scale,
      fontWeight: '700',
      color: '#3a3a3a',
      paddingVertical: 10 * scale,
      paddingHorizontal: 12 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#3a3a3a',
      textAlign: 'center',
    },
    entrevistaRow: {
      paddingVertical: 12 * scale,
      paddingHorizontal: 12 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#d9d9d9',
    },
    entrevistaRowLast: {
      borderBottomWidth: 0,
    },
    entrevistaText: {
      fontSize: 12.5 * scale,
      color: '#4a4a4a',
      textAlign: 'center',
    },
    sideCards: {
      flex: 1,
      justifyContent: 'space-between',
    },
    badgeCard: {
      flex: 1,
      backgroundColor: '#ffff',
      borderRadius: 14 * scale,
      padding: 12 * scale,
      justifyContent: 'center',
      marginBottom: 10 * scale,
      position: 'relative',
      borderWidth:1,
      borderColor:'45C5F3',
    },
    badgeDotsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    contatoAvatar: {
      width: 28 * scale,
      height: 28 * scale,
      borderRadius: 14 * scale,
      borderWidth: 2,
      borderColor: '#ffffff',
    },
    contatoAvatarVazio: {
      width: 28 * scale,
      height: 28 * scale,
      borderRadius: 14 * scale,
      backgroundColor: '#ffffff',
      opacity: 0.6,
    },
    badgeCountWrapper: {
      position: 'absolute',
      bottom: 8 * scale,
      right: 8 * scale,
      backgroundColor: '#8a8a8a',
      borderRadius: 10 * scale,
      paddingHorizontal: 6 * scale,
      paddingVertical: 2 * scale,
    },
    badgeCountText: {
      fontSize: 10 * scale,
      color: '#ffffff',
      fontWeight: '700',
    },
    socialCard: {
      flex: 1,
      backgroundColor: '#f3c9dd',
      borderRadius: 14 * scale,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    socialIcon: {
      marginHorizontal: 6 * scale,
    },
    vagaInteresseCard: {
      backgroundColor: '#54c3ea',
      borderRadius: 18 * scale,
      padding: 18 * scale,
    },
    vagaInteresseTitle: {
      fontSize: 17 * scale,
      fontWeight: '800',
      color: '#ffffff',
      marginBottom: 8 * scale,
    },
    vagaInteresseRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    vagaInteresseSubtitle: {
      fontSize: 14 * scale,
      color: '#ffffff',
      fontWeight: '600',
      marginRight: 6 * scale,
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
