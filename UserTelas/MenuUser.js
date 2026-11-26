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
import BarraPesquisaCampo from '../components/BarraPesquisaCampo';
import { irParaAba } from '../utils/navegacao';

const defaultEntrevistas = [
  { id: '1', data: '10/06', empresa: 'Monster' },
  { id: '2', data: '25/06', empresa: 'Sony' },
  { id: '3', data: '18/07', empresa: 'Google' },
];

export default function Menu({
  navigation,
  entrevistas = defaultEntrevistas,
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
            <BarraPesquisaCampo navigation={navigation} style={styles.searchInput} />

            <Ionicons
              name="search"
              size={18 * scale}
              color="#9b9b9b"
            />
          </View>
        </View>

        <View style={styles.cardWrap}>
          <View style={styles.cardVagas}>
            <TouchableOpacity
              onPress={() => navigation.navigate('VagasUser')}
              style={styles.button}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Procure vagas. Encontre sua vaga ideal."
            >
              <View style={styles.cardTextContainer}>
                <Text style={styles.cardTitle}>Procure vagas</Text>

                <Text style={styles.cardSub}>
                  Encontre sua vaga ideal.
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* A maleta fica por cima do canto do card, dentro da área do cardWrap */}
          <TouchableOpacity
            onPress={() => navigation.navigate('VagasUser')}
            style={styles.maletaBtn}
            activeOpacity={0.8}
            accessible={false}
          >
            <Image
              source={require('../assets/Maleta.png')}
              style={styles.cardImage}
              resizeMode="contain"
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
            <TouchableOpacity
              style={styles.socialCard}
              onPress={() => navigation.navigate('Assistente')}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Abrir a Nexi, assistente com inteligência artificial">
              <Image source={require('../assets/Nexi.png')} style={{ width: 40 * scale, height: 40 * scale }} resizeMode="contain" />
              <Text style={styles.socialText}>Nexi</Text>
            </TouchableOpacity>
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
          onPress={() => irParaAba(navigation, 'inicio', 'candidate')}
        >
          <Ionicons
            name="home"
            size={24 * scale}
            color="#54c3ea"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => irParaAba(navigation, 'chat', 'candidate')}
        >
          <Ionicons
            name="chatbubble-outline"
            size={22 * scale}
            color="#6f6f6f"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => irParaAba(navigation, 'vagas', 'candidate')}
        >
          <MaterialCommunityIcons
            name="briefcase-outline"
            size={23 * scale}
            color="#6f6f6f"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => irParaAba(navigation, 'notificacoes', 'candidate')}
        >
          <Ionicons
            name="notifications-outline"
            size={23 * scale}
            color="#6f6f6f"
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => irParaAba(navigation, 'menu', 'candidate')}
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
  // em tablet o conteúdo é limitado a 520px: o card se dimensiona por essa largura, não pela da tela
  const base = isTablet ? 520 : width;
  const maleta = base * 0.36; // tamanho da maleta do card "Procure vagas"

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

    // Card "Procure vagas": a maleta "salta" para fora do canto superior direito do card.
    // Para ela não ser cortada nem sumir, o cardWrap reserva o espaço dela (paddingTop e
    // margem direita negativa) e a maleta fica dentro dessa área, sobre o card.
    cardWrap: {
      alignSelf: 'stretch',
      marginTop: 20,
      marginBottom: 20,
      marginRight: -(maleta * 0.07),
      paddingTop: maleta * 0.26,
    },

    cardVagas: {
      backgroundColor: '#54c3ea',
      borderRadius: 25,
      padding: base * 0.06,
      marginRight: maleta * 0.07,
    },

    button: {
      minHeight: base * 0.28,
    },

    cardTextContainer: {
      flex: 1,
    },

    cardTitle: {
      color: '#fff',
      fontSize: base * 0.095,
      fontFamily: 'InterBold',
      fontWeight: '800',
      // não deixa o título passar por baixo da maleta
      marginRight: maleta * 0.62,
    },

    cardSub: {
      color: '#e9f0ff',
      fontSize: base * 0.05,
      marginTop: 10,
      fontFamily: 'Inter',
    },

    maletaBtn: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: maleta,
      height: maleta,
    },

    cardImage: {
      width: maleta,
      height: maleta,
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

    socialCard: {
      flex: 1,
      backgroundColor: '#f3c9dd',
      borderRadius: 14 * scale,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4 * scale,
      padding: 8 * scale,
    },

    socialText: {
      fontSize: 13 * scale,
      fontWeight: '800',
      color: '#3a3a3a',
      textAlign: 'center',
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