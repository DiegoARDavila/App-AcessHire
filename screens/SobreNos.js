import { Ionicons } from '@expo/vector-icons';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from 'react-native';

export default function SobreNos({ navigation }) {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);

  const styles = createStyles(scale, isSmallDevice, isTablet);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.topBar}>
        <Ionicons
          name="arrow-back"
          size={22 * scale}
          color="#4a4a4a"
          style={styles.backIcon}
          onPress={() => navigation.goBack()}
        />
        <View style={styles.topBarContent}>
          <Text style={styles.topBarTitle}>Configurações</Text>
          <Text style={styles.topBarSubtitle}>Sobre Nós</Text>
        </View>
        <View style={styles.backIconSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>O que é Acessibilidade?</Text>
          <Text style={styles.cardText}>
            A acessibilidade consiste na criação de ambientes, serviços e
            tecnologias que possam ser utilizados por todas as pessoas,
            independentemente de suas limitações físicas, sensoriais,
            intelectuais ou cognitivas.
          </Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Nosso Compromisso</Text>
          <Text style={styles.cardText}>
            Buscamos oferecer uma experiência inclusiva, garantindo que todos os
            usuários possam navegar pela plataforma, pesquisar vagas e acessar
            informações com autonomia e facilidade.
          </Text>
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Recursos de Acessibilidade</Text>
          <Text style={styles.cardText}>
            Nossa plataforma foi desenvolvida para ser compatível com tecnologias assistivas, como leitores de tela, ampliação de texto e navegação por teclado, promovendo uma experiência mais acessível para todos.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(
  scale,
  isSmallDevice,
  isTablet
) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: isSmallDevice ? 16 : 24,
      height: 90 * scale,
      paddingTop: 36 * scale,
      paddingBottom: 15 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#d1d1d1',
    },
    backIcon: {
      width: 22 * scale,
    },
    backIconSpacer: {
      width: 22 * scale,
    },
    topBarContent: {
      flexDirection: 'column',
      gap: 1 * scale,
    },
    topBarTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 15 * scale,
      fontWeight: '700',
      color: '#3a3a3a',
    },
    topBarSubtitle: {
      fontSize: 12 * scale,
      textAlign: 'center',
    },
    scrollContent: {
      padding: 30 * scale,
    },
    cardContent: {
      padding: 10 * scale,
      backgroundColor: '#45c5f3',
      borderRadius: 10,
      marginVertical: 10 * scale,
    },
    cardTitle: {
      fontSize: 30 * scale,
      color: '#ffffff',
      fontWeight: '800',
      textAlign: 'center',
    },
    cardText: {
      fontSize: 18 * scale,
      color: '#fff',
      padding: 15 * scale,
      textAlign: 'justify',
    },
  });
}
