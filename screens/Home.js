import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { useFonts } from 'expo-font';

const { width } = Dimensions.get('window');


export default function Home({ navigation }) {
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
 
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.6 : 1.25);
 
  const styles = createStyles(scale, isSmallDevice, isTablet, height);
 
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Logo AccessHire"
            />
          </View>
 
          <Text style={styles.brandText}>
            <Text style={styles.brandAccent}>Access</Text>
            <Text style={styles.brandDark}>Hire</Text>
          </Text>
          <Text style={styles.welcomeText}>Bem vindo!</Text>
        </View>

        <View style={styles.selectionBlock}>
          <Text style={styles.entrarLabel}>Entrar</Text>
 
          <TouchableOpacity
            style={[styles.button, styles.buttonPrimary]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Entrar como Usuário"
            onPress={() => navigation.navigate('LoginUser')}>
            <Text style={styles.buttonTextPrimary}>Usuário</Text>
          </TouchableOpacity>
 
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Entrar como Empresa"
            onPress={() => navigation.navigate('LoginEmp')}>
            <Text style={styles.buttonTextSecondary}>Empresa</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            activeOpacity={0.8}
            accessibilityRole="button"
            onPress={() => navigation.navigate('MenuUser')}>
            <Text style={styles.buttonTextSecondary}>MenuUser (Teste)</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonSecondary]}
            activeOpacity={0.8}
            accessibilityRole="button"
            onPress={() => navigation.navigate('MenuEmp')}>
            <Text style={styles.buttonTextSecondary}>MenuEmp (Teste)</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footerSpacer} />
      </View>
    </SafeAreaView>
  );
}
 
function createStyles(
  scale: number,
  isSmallDevice: boolean,
  isTablet: boolean,
  screenHeight: number
) {
  const maxContentWidth = isTablet ? 480 : '100%';
 
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    container: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: isSmallDevice ? 20 : 32,
      paddingTop: screenHeight * 0.06,
      maxWidth: maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    header: {
      alignItems: 'center',
    },
    iconWrapper: {
      marginTop: 50 * scale,
      width: 100 * scale,
      height: 100 * scale,
      justifyContent: 'center',
      alignItems: 'center',
      elevation: Platform.OS === 'android' ? 4 : 0,
    },
    logo: {
      width: '150%',
      height: '150%',
    },
    brandText: {
      marginTop: 25 * scale,
      fontSize: 24 * scale,
      fontWeight: '800',
    },
    brandAccent: {
      color: '#45c5f3',
    },
    brandDark: {
      color: '#7c7c7c',
    },
    welcomeText: {
      marginTop: 4,
      fontSize: 13 * scale,
      fontWeight: '700',
      color: '#8a8a8a',
      letterSpacing: 0.3,
    },
    selectionBlock: {
      width: '100%',
      marginTop: screenHeight * 0.08,
      alignItems: 'center',
    },
    entrarLabel: {
      fontSize: 16 * scale,
      fontWeight: '700',
      color: '#6f6f6f',
      marginBottom: 20 * scale,
    },
    button: {
      width: '70%',
      paddingVertical: 16 * scale,
      borderRadius: 20 * scale,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 14 * scale,
    },
    buttonPrimary: {
      backgroundColor: '#45c5f3',
    },
    buttonSecondary: {
      backgroundColor: '#7c7c7c',
    },
    buttonTextPrimary: {
      color: '#ffffff',
      fontSize: 20 * scale,
      fontWeight: '700',
    },
    buttonTextSecondary: {
      color: '#ffffff',
      fontSize: 20 * scale,
      fontWeight: '700',
    },
    footerSpacer: {
      flex: 1,
    },
  });
}