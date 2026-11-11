import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  Alert,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { PLANOS } from '../constants/planos';
import { getProfile } from '../services/auth';
import { auth } from '../services/firebase';

export default function PlanoDetalhe({ route, navigation }) {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet);

  const plano = PLANOS[route?.params?.plano] ?? PLANOS.inicial;
  const [planoAtual, setPlanoAtual] = useState('inicial');

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    getProfile(uid, 'company')
      .then((perfil) => {
        if (perfil?.plano && PLANOS[perfil.plano]) setPlanoAtual(perfil.plano);
      })
      .catch((e) => console.log('Erro ao carregar plano:', e));
  }, []);

  const atual = plano.id === planoAtual;
  const podeAssinar = !atual && plano.id !== 'inicial';

  function assinar() {
    // O pagamento ainda não existe no app: por isso não alteramos o plano aqui.
    Alert.alert(
      'Em breve',
      `A assinatura do ${plano.nome} ainda não está disponível nesta versão do AccessHire.`
    );
  }

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
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        />
        <View style={styles.topBarContent}>
          <Text style={styles.topBarTitle}>Configurações</Text>
          <Text style={styles.topBarSubtitle}>Seu Plano</Text>
        </View>
        <View style={styles.backIconSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, { backgroundColor: plano.cor }]}>
          <View style={styles.tituloBox}>
            <Text style={[styles.titulo, { color: plano.corTexto }]}>{plano.nome}</Text>
          </View>

          <View style={styles.corpo}>
            <Text style={[styles.texto, { color: plano.corTexto }]}>
              <Text style={styles.negrito}>Ideal para: </Text>
              {plano.idealPara}
            </Text>

            <Text style={[styles.texto, styles.negrito, styles.subtitulo, { color: plano.corTexto }]}>
              Benefícios:
            </Text>
            {plano.beneficios.map((b) => (
              <View key={b} style={styles.linhaBeneficio}>
                <Text style={[styles.texto, { color: plano.corTexto }]}>{'•'}</Text>
                <Text style={[styles.texto, styles.textoBeneficio, { color: plano.corTexto }]}>{b}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.preco, { color: plano.corTexto }]}>
            {atual ? 'Selecionado' : plano.preco ?? 'Gratuito'}
          </Text>
        </View>

        {podeAssinar && (
          <TouchableOpacity
            style={styles.botaoAssinar}
            onPress={assinar}
            accessibilityRole="button"
            accessibilityLabel={`Assinar o ${plano.nome}`}>
            <Text style={styles.botaoAssinarTexto}>Assinar o {plano.nome}</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.rodape}>{plano.rodape}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(scale, isSmallDevice, isTablet) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
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
    backIcon: { width: 22 * scale },
    backIconSpacer: { width: 22 * scale },
    topBarContent: { flexDirection: 'column', gap: 1 * scale },
    topBarTitle: { textAlign: 'center', fontSize: 15 * scale, fontWeight: '700', color: '#3a3a3a' },
    topBarSubtitle: { fontSize: 12 * scale, textAlign: 'center', color: '#3a3a3a' },
    scrollContent: {
      paddingHorizontal: isSmallDevice ? 16 : 24,
      paddingTop: 24 * scale,
      paddingBottom: 32 * scale,
      maxWidth: isTablet ? 520 : '100%',
      width: '100%',
      alignSelf: 'center',
    },
    card: { borderRadius: 14 * scale, paddingBottom: 22 * scale },
    tituloBox: {
      paddingHorizontal: 14 * scale,
      paddingVertical: 12 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff',
    },
    titulo: { fontSize: 26 * scale, fontWeight: '800' },
    corpo: { paddingHorizontal: 14 * scale, paddingTop: 16 * scale },
    texto: { fontSize: 17 * scale, lineHeight: 24 * scale },
    negrito: { fontWeight: '800' },
    subtitulo: { marginTop: 18 * scale, marginBottom: 4 * scale },
    linhaBeneficio: { flexDirection: 'row', gap: 10 * scale, paddingLeft: 10 * scale },
    textoBeneficio: { flex: 1 },
    preco: {
      fontSize: 24 * scale,
      fontWeight: '800',
      textAlign: 'center',
      marginTop: 28 * scale,
    },
    botaoAssinar: {
      backgroundColor: '#45c5f3',
      borderRadius: 12 * scale,
      paddingVertical: 14 * scale,
      alignItems: 'center',
      marginTop: 26 * scale,
    },
    botaoAssinarTexto: { color: '#ffffff', fontWeight: '700', fontSize: 18 * scale },
    rodape: {
      fontSize: 12 * scale,
      color: '#6f6f6f',
      textAlign: 'center',
      marginTop: 14 * scale,
    },
  });
}