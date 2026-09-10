import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

type LoginUsuarioScreenProps = {
  onBack?: () => void;
  onLogin?: (email: string, senha: string) => void;
  onGoToCadastro?: () => void;
  onGoToEmpresaLogin?: () => void;
};

export default function Login({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.6 : 1.25);

  const styles = createStyles(scale, isSmallDevice, isTablet, height);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
            <TouchableOpacity
              style={styles.backButton}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => navigation.navigate('Home')}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>

          <View style={styles.header}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessibilityLabel="Logo AccessHire"
            />
            <View style={styles.headerTextBlock}>
              <Text style={styles.brandText}>
                <Text style={styles.brandAccent}>Access</Text>
                <Text style={styles.brandDark}>Hire</Text>
              </Text>
              <Text style={styles.subtitleText}>Login De Empresas</Text>
            </View>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#9b9b9b"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoCorrect={false}
              accessibilityLabel="Campo de email"
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              placeholderTextColor="#9b9b9b"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry
              autoCapitalize="none"
              accessibilityLabel="Campo de senha"
            />

            <TouchableOpacity
              style={styles.loginButton}
              activeOpacity={0.8}
              onPress={() => onLogin?.(email, senha)}
              accessibilityRole="button"
              accessibilityLabel="Fazer login"
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}
            onPress={() => navigation.navigate('CadastroEmp')}
            >
              Não possui Login?{' '}
              <Text style={styles.footerLink}>
                Cadastre-se aqui!
              </Text>
            </Text>
            <Text style={[styles.footerText, { marginTop: 6 }]}
            onPress={() => navigation.navigate('LoginUser')}
            >
              É um Usuário?{' '}
              <Text style={styles.footerLink}>
                Clique aqui!
              </Text>
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: isSmallDevice ? 20 : 32,
      paddingTop: 16,
      maxWidth: maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    backButton: {
      width: '100%',
      justifyContent: 'center',
      marginTop: 30,
    },
    backArrow: {
      fontSize: 40 * scale,
      color: '#4a4a4a',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20 * scale,
      justifyContent: 'center',
    },
    logo: {
      width: 70 * scale,
      height: 70 * scale,
      borderRadius: 16 * scale,
      backgroundColor: '#54c3ea',
    },
    headerTextBlock: {
      marginLeft: 14 * scale,
    },
    brandText: {
      fontSize: 30 * scale,
      fontWeight: '800',
    },
    brandAccent: {
      color: '#45c5f3',
    },
    brandDark: {
      color: '#7c7c7c',
    },
    subtitleText: {
      marginTop: 2,
      fontSize: 15 * scale,
      fontWeight: '700',
      color: '#6f6f6f',
    },
    form: {
      marginTop: screenHeight * 0.1,
      alignItems: 'center',
    },
    input: {
      width: '80%',
      borderWidth: 1,
      borderColor: '#d9d9d9',
      borderRadius: 10 * scale,
      paddingVertical: 14 * scale,
      paddingHorizontal: 16 * scale,
      fontSize: 15 * scale,
      color: '#4a4a4a',
      marginBottom: 14 * scale,
      backgroundColor: '#ffffff',
    },
    loginButton: {
      backgroundColor: '#54c3ea',
      borderRadius: 12 * scale,
      paddingVertical: 16 * scale,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 30 * scale,
      width: '60%',
    },
    loginButtonText: {
      color: '#ffffff',
      fontSize: 16 * scale,
      fontWeight: '700',
    },
    footer: {
      flex: 1,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingVertical: 40 * scale,
      gap: 10,
    },
    footerText: {
      fontSize: 13 * scale,
      color: '#6f6f6f',
      textAlign: 'center',
    },
    footerLink: {
      color: '#45c5f3',
      fontWeight: '700',
    },
  });
}