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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

export default function ConfigUser({ navigation }) {
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
          onPress={() => navigation.navigate('MenuUser')}
        />
        <Text style={styles.topBarTitle}>Configurações</Text>
        <View style={styles.backIconSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <TouchableOpacity
          style={styles.configOpt}
          onPress={() => navigation.navigate('SegurancaUser')}>
          <Ionicons
            name="lock-closed-outline"
            size={30 * scale}
            color="#4a4a4a"
            style={styles.configIcons}
          />
          <Text style={styles.configTxt}>Segurança</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.configOpt}
        onPress={() => navigation.navigate('Dados')}
        >
          <Ionicons
            name="shield-outline"
            size={30 * scale}
            color="#4a4a4a"
            style={styles.configIcons}
          />
          <Text style={styles.configTxt}>Privacidade de Dados</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.configOpt}
        onPress={() => navigation.navigate('Acessibilidade')}
        >
          <Ionicons
            name="accessibility-outline"
            size={30 * scale}
            color="#4a4a4a"
            style={styles.configIcons}
          />
          <Text style={styles.configTxt}>Acessibilidade</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.configOpt}
          onPress={() => navigation.navigate('SobreNos')}
        >
          <Ionicons
            name="person-outline"
            size={30 * scale}
            color="#4a4a4a"
            style={styles.configIcons}
          />
          <Text style={styles.configTxt}>Sobre Nós</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.configOpt}>
          <Ionicons
            name="log-out-outline"
            size={30 * scale}
            color="#4a4a4a"
            style={styles.configIcons}
          />
          <Text style={styles.configTxt}>Sair</Text>
        </TouchableOpacity>
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
      paddingTop: 40,
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
    topBarTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 15 * scale,
      fontWeight: '700',
      color: '#3a3a3a',
    },
    scrollContent: {
      padding: 50 * scale,
    },
    configOpt: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 30,
      marginVertical: 13 * scale,
    },
    configTxt: {
      fontSize: 16 * scale,
    },
  });
}
