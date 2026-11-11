import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { ORDEM_PLANOS, PLANOS } from '../constants/planos';
import { getProfile } from '../services/auth';
import { auth } from '../services/firebase';

export default function Planos({ navigation }) {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet);

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
        {ORDEM_PLANOS.map((id) => {
          const plano = PLANOS[id];
          const atual = id === planoAtual;
          const mostrarAdquirir = !atual && id !== 'inicial';

          return (
            <TouchableOpacity
              key={id}
              activeOpacity={0.9}
              style={[styles.card, { backgroundColor: plano.cor }]}
              onPress={() => navigation.navigate('PlanoDetalhe', { plano: id })}
              accessibilityRole="button"
              accessibilityLabel={`${plano.nome}${atual ? ', selecionado' : ''}. Toque para ver os detalhes`}>
              <View style={styles.tituloBox}>
                <Text style={[styles.titulo, { color: plano.corTexto }]}>
                  {plano.nome}
                  {atual ? ' (Selecionado)' : ''}
                </Text>
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

              {mostrarAdquirir && (
                <TouchableOpacity
                  style={styles.botaoAdquirir}
                  onPress={() => navigation.navigate('PlanoDetalhe', { plano: id })}
                  accessibilityRole="button"
                  accessibilityLabel={`Adquirir o ${plano.nome}`}>
                  <Text style={styles.botaoAdquirirTexto}>Adquirir</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })}
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
      paddingTop: 28 * scale,
      paddingBottom: 32 * scale,
      maxWidth: isTablet ? 520 : '100%',
      width: '100%',
      alignSelf: 'center',
      gap: 26 * scale,
    },
    card: { borderRadius: 14 * scale, paddingBottom: 14 * scale },
    tituloBox: {
      paddingHorizontal: 14 * scale,
      paddingVertical: 10 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#ffffff',
    },
    titulo: { fontSize: 20 * scale, fontWeight: '800' },
    corpo: { paddingHorizontal: 14 * scale, paddingTop: 12 * scale },
    texto: { fontSize: 13.5 * scale, lineHeight: 19 * scale },
    negrito: { fontWeight: '800' },
    subtitulo: { marginTop: 10 * scale, marginBottom: 2 * scale },
    linhaBeneficio: { flexDirection: 'row', gap: 8 * scale, paddingLeft: 8 * scale },
    textoBeneficio: { flex: 1 },
    botaoAdquirir: {
      position: 'absolute',
      top: -16 * scale,
      right: 8 * scale,
      backgroundColor: '#45c5f3',
      borderRadius: 14 * scale,
      paddingVertical: 6 * scale,
      paddingHorizontal: 16 * scale,
    },
    botaoAdquirirTexto: { color: '#ffffff', fontWeight: '700', fontSize: 13 * scale },
  });
}