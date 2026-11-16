import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  DATA_TERMOS,
  PRIVACIDADE,
  TERMOS_DE_USO,
  VERSAO_TERMOS,
} from '../constants/termos';

const ABAS = [
  { id: 'termos', nome: 'Termos de Uso', secoes: TERMOS_DE_USO },
  { id: 'privacidade', nome: 'Privacidade e LGPD', secoes: PRIVACIDADE },
];

// route.params.aba: 'termos' (padrão) ou 'privacidade'
export default function Termos({ route, navigation }) {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet);

  const [aba, setAba] = useState(route?.params?.aba === 'privacidade' ? 'privacidade' : 'termos');
  const atual = ABAS.find((a) => a.id === aba);

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
          <Text style={styles.topBarTitle}>{atual.nome}</Text>
          <Text style={styles.topBarSubtitle}>
            Versão {VERSAO_TERMOS} · {DATA_TERMOS}
          </Text>
        </View>
        <View style={styles.backIconSpacer} />
      </View>

      <View style={styles.abas}>
        {ABAS.map((a) => {
          const ativa = a.id === aba;
          return (
            <TouchableOpacity
              key={a.id}
              style={[styles.aba, ativa && styles.abaAtiva]}
              onPress={() => setAba(a.id)}
              accessibilityRole="tab"
              accessibilityState={{ selected: ativa }}>
              <Text style={[styles.abaTexto, ativa && styles.abaTextoAtivo]}>{a.nome}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator>
        {atual.secoes.map((secao) => (
          <View key={secao.titulo} style={styles.secao}>
            <Text style={styles.secaoTitulo} accessibilityRole="header">
              {secao.titulo}
            </Text>
            {secao.paragrafos?.map((p) => (
              <Text key={p} style={styles.paragrafo}>
                {p}
              </Text>
            ))}
            {secao.itens?.map((item) => (
              <View key={item} style={styles.linhaItem}>
                <Text style={styles.paragrafo}>{'•'}</Text>
                <Text style={[styles.paragrafo, styles.itemTexto]}>{item}</Text>
              </View>
            ))}
            {secao.depois ? <Text style={[styles.paragrafo, styles.depois]}>{secao.depois}</Text> : null}
            {secao.destaque ? (
              <Text
                style={styles.email}
                accessibilityRole="link"
                onPress={() => Linking.openURL(`mailto:${secao.destaque}`).catch(() => {})}>
                {secao.destaque}
              </Text>
            ) : null}
          </View>
        ))}
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
    topBarSubtitle: { fontSize: 11 * scale, textAlign: 'center', color: '#6f6f6f' },
    abas: {
      flexDirection: 'row',
      marginHorizontal: isSmallDevice ? 16 : 24,
      marginTop: 14 * scale,
      borderWidth: 1,
      borderColor: '#45c5f3',
      borderRadius: 12 * scale,
      overflow: 'hidden',
      maxWidth: isTablet ? 520 : '100%',
      alignSelf: 'center',
      width: isTablet ? 520 : undefined,
    },
    aba: { flex: 1, paddingVertical: 10 * scale, alignItems: 'center', backgroundColor: '#ffffff' },
    abaAtiva: { backgroundColor: '#45c5f3' },
    abaTexto: { fontSize: 13 * scale, fontWeight: '700', color: '#3a3a3a' },
    abaTextoAtivo: { color: '#ffffff' },
    scrollContent: {
      paddingHorizontal: isSmallDevice ? 16 : 24,
      paddingTop: 18 * scale,
      paddingBottom: 40 * scale,
      maxWidth: isTablet ? 520 : '100%',
      width: '100%',
      alignSelf: 'center',
    },
    secao: { marginBottom: 20 * scale },
    secaoTitulo: { fontSize: 16 * scale, fontWeight: '800', color: '#3a3a3a', marginBottom: 6 * scale },
    paragrafo: { fontSize: 14 * scale, lineHeight: 21 * scale, color: '#4a4a4a', marginBottom: 4 * scale },
    linhaItem: { flexDirection: 'row', gap: 8 * scale, paddingLeft: 6 * scale },
    itemTexto: { flex: 1 },
    depois: { marginTop: 6 * scale },
    email: { fontSize: 14 * scale, fontWeight: '700', color: '#1787d5', marginTop: 2 * scale },
  });
}