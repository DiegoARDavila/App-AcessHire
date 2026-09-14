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


export default function ConfigEmp({ navigation }) {

  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);

  const styles = createStyles(scale, isSmallDevice, isTablet);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.topBar}>
        <Ionicons name="arrow-back" size={22 * scale} color="#4a4a4a" style={styles.backIcon} />
        <Text style={styles.topBarTitle}>Configurações</Text>
        <View style={styles.backIconSpacer} />
      </View>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
      <View style={styles.configOpt}>
        <Ionicons name="lock-closed-outline" size={30 * scale} color="#4a4a4a" style={styles.configIcons}/>
        <Text style={styles.configTxt}>Segurança</Text>
      </View>
      <View style={styles.configOpt}>
        <Ionicons name="shield-outline" size={30 * scale} color="#4a4a4a" style={styles.configIcons}/>
        <Text  style={styles.configTxt}>Privacidade de Dados</Text>
      </View>
      <View style={styles.configOpt}>
        <Image source={require('../assets/logo.png')} style={styles.logoOpt}/>
        <Text  style={styles.configTxt}>Sua Assinatura</Text>
      </View>
      <View style={styles.configOpt}>
        <Ionicons name="accessibility-outline" size={30 * scale} color="#4a4a4a" style={styles.configIcons}/>
        <Text  style={styles.configTxt}>Acessibilidade</Text>
      </View>
      <View style={styles.configOpt}>
        <Ionicons name="person-outline" size={30 * scale} color="#4a4a4a" style={styles.configIcons}/>
        <Text  style={styles.configTxt}>Sobre Nós</Text>
      </View>
      <View style={styles.configOpt}>
        <Ionicons name="log-out-outline" size={30 * scale} color="#4a4a4a" style={styles.configIcons}/>
        <Text  style={styles.configTxt}>Sair</Text>
      </View>
       </ScrollView>
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
    logoOpt: {
      width: 30 * scale,
      height: 30 *scale, 
      borderRadius: 3 * scale,
    },
    configTxt: {
      fontSize: 16 * scale,
    },
  });
}