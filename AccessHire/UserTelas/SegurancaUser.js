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

export default function SegurancaUser({ navigation }) {
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
          <Text style={styles.topBarSubtitle}>Segurança</Text>
        </View>
        <View style={styles.backIconSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Acesso à Conta</Text>

        <View style={styles.inputGrid}>
          <View style={styles.inputBox}>
            <Text style={styles.inputTitle}>Endereço de e-mail</Text>
            <Text style={styles.inputText}>usuario@email.com</Text>
          </View>
          <View style={styles.inputBox}>
            <Text style={styles.inputTitle}>Número de Telefone</Text>
            <Text style={styles.inputText}>00 98765-4321</Text>
          </View>
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
    title: {
      fontSize: 25 * scale,
      color: '#3a3a3a',
      fontWeight: '800',
    },
    inputGrid: {
      flexDirection: 'column',
      gap: 20,
      marginVertical: 30 * scale,
    },
    inputBox: {
      flexDirection: 'column',
      gap: 10,
    },
    inputTitle: {
      fontSize: 20 * scale,
      color: '#3a3a3a'
    },
    inputText: {
      borderWidth: 1,
      borderColor: '#d9d9d9',
      borderRadius: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: '#ffffff',
      fontSize: 15,
      color: '#4a4a4a',
    },
  });
}
