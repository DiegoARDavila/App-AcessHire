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

export default function DadosUser({ navigation }) {
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
          onPress={() => navigation.navigate('ConfigUser')}
        />
        <View style={styles.topBarContent}>
          <Text style={styles.topBarTitle}>Configurações</Text>
          <Text style={styles.topBarSubtitle}>Dados</Text>
        </View>
        <View style={styles.backIconSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>O uso dos seus dados</Text>
          <Text style={styles.cardText}>
            A segurança e a privacidade dos usuários são prioridades no nosso
            aplicativo. Todos os dados coletados são utilizados exclusivamente
            para melhorar a experiência dentro da plataforma e conectar talentos
            a oportunidades de forma justa e eficaz. Seguimos padrões de
            proteção de dados, como a LGPD, garantindo que nenhuma informação
            pessoal seja compartilhada com terceiros sem consentimento. Além
            disso, usamos tecnologias de criptografia e boas de segurança para
            que os dados estejam sempre protegidos. Oferecemos um ambiente
            confiável, que respeita a privacidade e não causa nenhum
            prejuízo ao usuário.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(
  scale: number,
  isSmallDevice: boolean,
  isTablet: boolean
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
