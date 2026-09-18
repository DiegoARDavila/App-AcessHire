// @ts-nocheck
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    useWindowDimensions,
    View
} from 'react-native';

function calcularPercentualExigido(totalFuncionarios) {
  if (totalFuncionarios < 100) return 0;
  if (totalFuncionarios <= 200) return 0.02;
  if (totalFuncionarios <= 500) return 0.03;
  if (totalFuncionarios <= 1000) return 0.04;
  return 0.05;
}

export default function CalculoEmp({ navigation, onSearch }) {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet, width);

  const [totalFuncionarios, setTotalFuncionarios] = useState('');
  const [funcionariosPCD, setFuncionariosPCD] = useState('');
  const [resultado, setResultado] = useState(null);

  function handleCalcular() {
    const total = parseInt(totalFuncionarios, 10);
    const pcd = parseInt(funcionariosPCD, 10);

    if (isNaN(total) || isNaN(pcd) || total <= 0) {
      setResultado({ erro: 'Preenche os dois campos com números válidos.' });
      return;
    }

    const percentualExigido = calcularPercentualExigido(total);

    if (percentualExigido === 0) {
      setResultado({
        isento: true,
        texto: 'Empresas com menos de 100 funcionários não são obrigadas pela Lei de Cotas.',
      });
      return;
    }

    const vagasNecessarias = Math.ceil(total * percentualExigido);
    const faltam = Math.max(0, vagasNecessarias - pcd);
    const percentualAtual = ((pcd / total) * 100).toFixed(1);

    setResultado({
      percentualExigido: (percentualExigido * 100).toFixed(0),
      percentualAtual,
      vagasNecessarias,
      faltam,
      cumprida: faltam === 0,
    });
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Ionicons name="arrow-back" size={22 * scale} color="#4a4a4a" onPress={() => navigation.goBack()} />
          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar"
              placeholderTextColor="#9b9b9b"
              onChangeText={onSearch}
              accessibilityLabel="Campo de pesquisa"
            />
            <Ionicons name="search" size={18 * scale} color="#9b9b9b" />
          </View>
        </View>

        <View style={styles.contentconteiner}>
          <Text style={styles.inputTitle}>Cálculo Lei de Cotas</Text>

          <View style={styles.inputBox}>
            <Text style={styles.subtext}>Funcionários totais da empresa</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Ex: 500"
              placeholderTextColor="#9b9b9b"
              value={totalFuncionarios}
              onChangeText={setTotalFuncionarios}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputBox}>
            <Text style={styles.subtext}>Funcionários PCD</Text>
            <TextInput
              style={styles.inputText}
              placeholder="Ex: 12"
              placeholderTextColor="#9b9b9b"
              value={funcionariosPCD}
              onChangeText={setFuncionariosPCD}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.viewButtom}>
            <TouchableOpacity style={styles.buttomCalcular} onPress={handleCalcular}>
              <Text style={styles.textButtom}>Calcular</Text>
            </TouchableOpacity>
          </View>

          {resultado?.erro && (
            <Text style={styles.erroTexto}>{resultado.erro}</Text>
          )}

          {resultado?.isento && (
            <View style={styles.resultadoBox}>
              <Text style={styles.resultadoTexto}>{resultado.texto}</Text>
            </View>
          )}

          {resultado && !resultado.erro && !resultado.isento && (
            <View style={styles.resultadoBox}>
              <Text style={styles.resultadoTexto}>
                Percentual exigido por lei: {resultado.percentualExigido}%
              </Text>
              <Text style={styles.resultadoTexto}>
                Percentual atual da empresa: {resultado.percentualAtual}%
              </Text>
              {resultado.cumprida ? (
                <Text style={[styles.resultadoTexto, { color: '#2e7d32', fontWeight: '700', marginTop: 8 }]}>
                  ✓ Sua empresa está cumprindo a cota legal.
                </Text>
              ) : (
                <Text style={[styles.resultadoTexto, { color: '#c0392b', fontWeight: '700', marginTop: 8 }]}>
                  Faltam {resultado.faltam} contratação(ões) PCD para cumprir a cota.
                </Text>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <Ionicons name="home" size={24 * scale} color="#6f6f6f" onPress={() => navigation.navigate('MenuEmp')} />
        <Ionicons name="chatbubble-outline" size={22 * scale} color="#6f6f6f" onPress={() => navigation.navigate('Chat')} />
        <MaterialCommunityIcons name="briefcase-outline" size={23 * scale} color="#6f6f6f" onPress={() => navigation.navigate('VagasEmp')} />
        <Ionicons name="notifications-outline" size={23 * scale} color="#6f6f6f" onPress={() => navigation.navigate('Notificacoes')} />
        <Ionicons name="menu" size={24 * scale} color="#54c3ea" onPress={() => navigation.navigate('ConfigEmp')} />
      </View>
    </SafeAreaView>
  );
}

function createStyles(scale, isSmallDevice, isTablet, width) {
  const maxContentWidth = isTablet ? 520 : '100%';
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    scrollContent: {
      paddingHorizontal: isSmallDevice ? 16 : 24, paddingTop: 40, paddingBottom: 24,
      maxWidth: maxContentWidth, width: '100%', alignSelf: 'center',
    },
    topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 * scale, gap: 10 },
    searchBar: {
      flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f2f2',
      borderRadius: 20 * scale, paddingHorizontal: 16 * scale, paddingVertical: 10 * scale, marginLeft: 12 * scale,
    },
    searchInput: { flex: 1, fontSize: 14 * scale, color: '#4a4a4a' },
    bottomNav: {
      flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
      backgroundColor: '#e9e6f2', borderRadius: 30 * scale,
      marginHorizontal: isSmallDevice ? 16 : 24, marginBottom: 20 * scale, paddingVertical: 12 * scale,
    },
    contentconteiner: {},
    inputText: {
      borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 10, paddingVertical: 14,
      paddingHorizontal: 16, backgroundColor: '#ffffff', fontSize: 15, color: '#4a4a4a',
    },
    inputBox: { flexDirection: 'column', gap: 10, marginTop: 20 },
    inputTitle: { fontSize: 20 * scale, color: '#3a3a3a', fontWeight: '800' },
    subtext: { fontSize: 15 * scale, color: '#5C5C5C' },
    buttomCalcular: {
      backgroundColor: '#45C5F3', borderRadius: 20, alignItems: 'center',
      height: 43, width: 165, justifyContent: 'center',
    },
    textButtom: { color: '#FFFF', fontSize: 22 },
    viewButtom: { alignItems: 'center', marginTop: 50 },
    erroTexto: { color: 'red', marginTop: 20, textAlign: 'center' },
    resultadoBox: {
      marginTop: 24, padding: 16, borderRadius: 14, borderWidth: 1, borderColor: '#45C5F3', backgroundColor: '#f0fbff',
    },
    resultadoTexto: { fontSize: 14, color: '#3a3a3a', marginBottom: 4 },
  });
}