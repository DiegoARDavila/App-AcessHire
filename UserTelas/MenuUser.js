import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import React from 'react';
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

const defaultEntrevistas = [
  { id: '1', data: '10/06', empresa: 'Monster' },
  { id: '2', data: '25/06', empresa: 'Sony' },
  { id: '3', data: '18/07', empresa: 'Google' },
];

export default function Menu({
  navigation,
  entrevistas = defaultEntrevistas,
  contatos = [],
  totalContatos,
  onSearch,
}) {
  const { width } = useWindowDimensions();

  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(
    Math.max(width / 320, 0.85),
    isTablet ? 1.5 : 1.2
  );

  const styles = createStyles(scale, isSmallDevice, isTablet, width);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('PerfilUser')}
          >
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

            <Ionicons
              name="search"
              size={18 * scale}
              color="#9b9b9b"
            />
          </View>
        </View>

        <View style={styles.cardVagas}>
          <TouchableOpacity
            onPress={() => navigation.navigate('VagasUser')}
            style={styles.button}
            activeOpacity={0.8}
          >
            <View style={styles.cardTextContainer}>
              <Text style={styles.cardTitle}>Procure vagas</Text>

              <Text style={styles.cardSub}>
                Encontre sua vaga ideal.
              </Text>
            </View>

            <Image
              source={require('../assets/Maleta.png')}
              style={styles.cardImage}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Sua carreira</Text>

        <View style={styles.careerRow}>
          <View style={styles.entrevistasBox}>
            <Text style={styles.entrevistasHeader}>
              Entrevistas
            </Text>

            {entrevistas.map((item, index) => (
              <View
                key={item.id}
                style={[
                  styles.entrevistaRow,
                  index === entrevistas.length - 1 &&
                  styles.entrevistaRowLast,
                ]}
              >
                <Text style={styles.entrevistaText}>
                  {item.data} - {item.empresa}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.sideCards}>
            <View style={styles.badgeCard}>
              <View style={styles.badgeDotsRow}>
                {contatos.slice(0, 4).map((contato) => (
                  <Image
                    key={contato.id}
                    source={{ uri: contato.avatarUri }}
                    style={styles.contatoAvatar}
                  />
                ))}

                {Array.from({
                  length: Math.max(0, 4 - contatos.length),
                }).map((_, i) => (
                  <View
                    key={`vazio-${i}`}
                    style={styles.contatoAvatarVazio}
                  />
                ))}
              </View>

              {typeof totalContatos === 'number' && (
                <View style={styles.badgeCountWrapper}>
                  <Text style={styles.badgeCountText}>
                    +{totalContatos}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.socialCard}>
              <FontAwesome
                name="facebook"
                size={16 * scale}
                color="#ffffff"
                style={styles.socialIcon}
              />

              <FontAwesome
                name="instagram"
                size={16 * scale}
                color="#ffffff"
                style={styles.socialIcon}
              />

              <FontAwesome
                name="twitter"
                size={16 * scale}
                color="#ffffff"
                style={styles.socialIcon}
              />
            </View>
          </View>
        </View>

        <View style={styles.vagaInteresseCard}>
          <Text style={styles.vagaInteresseTitle}>
            Vagas de interesse
          </Text>

          <View style={styles.vagaInteresseRow}>
            <Text style={styles.vagaInteresseSubtitle}>
              Microsoft
            </Text>

            <Ionicons
              name="information-circle-outline"
              size={18 * scale}
              color="#ffffff"
            />
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Menu')}
        >
          <Ionicons
            name="home"
            size={24 * scale}
            color="#54c3ea"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Chat')}
        >
          <Ionicons
            name="chatbubble-outline"
            size={22 * scale}
            color="#6f6f6f"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('VagasUser')}
        >
          <MaterialCommunityIcons
            name="briefcase-outline"
            size={23 * scale}
            color="#6f6f6f"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('Notificacoes')}
        >
          <Ionicons
            name="notifications-outline"
            size={23 * scale}
            color="#6f6f6f"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate('ConfigUser')}
        >
          <Ionicons
            name="menu"
            size={24 * scale}
            color="#6f6f6f"
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function createStyles(
  scale,
  isSmallDevice,
  isTablet,
  width
) {
  const maxContentWidth = isTablet ? 520 : undefined;

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

    cardVagas: {
      backgroundColor: '#54c3ea',
      width: width * 0.9,
      alignSelf: 'center',
      borderRadius: 25,
      padding: width * 0.08,
      flexDirection: 'row',
      alignItems: 'center',
      margin: 30,
    },

    button: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: width * 0.28,
    },

    cardTextContainer: {
      flex: 1,
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
      right: width * -0.1,
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
      backgroundColor: '#d9cf9a',
      borderRadius: 14 * scale,
      padding: 12 * scale,
      justifyContent: 'center',
      marginBottom: 10 * scale,
      position: 'relative',
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