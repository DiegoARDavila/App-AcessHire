import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { carregarPerfisPesquisaveis, filtrarPerfis } from '../services/busca';
import { auth } from '../services/firebase';

export default function Busca({ navigation }) {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet);

  const [texto, setTexto] = useState('');
  const [dados, setDados] = useState({ buscaCandidatos: false, itens: [] });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) {
      setCarregando(false);
      return;
    }
    carregarPerfisPesquisaveis(uid)
      .then(setDados)
      .catch((e) => {
        console.log('Erro na busca:', e);
        setErro('Não foi possível carregar a busca. Tente de novo.');
      })
      .finally(() => setCarregando(false));
  }, []);

  const resultados = useMemo(() => filtrarPerfis(dados.itens, texto), [dados.itens, texto]);
  const alvo = dados.buscaCandidatos ? 'candidatos' : 'empresas';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.topBar}>
        <Ionicons
          name="arrow-back"
          size={22 * scale}
          color="#4a4a4a"
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        />
        <View style={styles.searchBar}>
          <TextInput
            style={styles.searchInput}
            placeholder={`Pesquisar ${alvo}`}
            placeholderTextColor="#9b9b9b"
            value={texto}
            onChangeText={setTexto}
            autoFocus
            autoCorrect={false}
            returnKeyType="search"
            accessibilityLabel={`Campo de pesquisa de ${alvo}`}
          />
          {texto ? (
            <Ionicons
              name="close-circle"
              size={18 * scale}
              color="#9b9b9b"
              onPress={() => setTexto('')}
              accessibilityRole="button"
              accessibilityLabel="Limpar pesquisa"
            />
          ) : (
            <Ionicons name="search" size={18 * scale} color="#9b9b9b" />
          )}
        </View>
      </View>

      {carregando ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#45c5f3" />
      ) : erro ? (
        <Text style={styles.vazio}>{erro}</Text>
      ) : (
        <FlatList
          data={resultados}
          keyExtractor={(i) => `${i.tipo}-${i.id}`}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.lista}
          ListHeaderComponent={
            <Text style={styles.contagem}>
              {texto ? `${resultados.length} resultado(s)` : `Todos os ${alvo}`}
            </Text>
          }
          ListEmptyComponent={
            <Text style={styles.vazio}>
              {texto ? `Nenhum resultado para "${texto}".` : `Ainda não há ${alvo} cadastrados.`}
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate('PerfilPublico', { tipo: item.tipo, id: item.id })}
              accessibilityRole="button"
              accessibilityLabel={`Ver perfil de ${item.nome}`}>
              <Image source={require('../assets/UserPhotoEX.png')} style={styles.foto} />
              <View style={{ flex: 1 }}>
                <Text style={styles.nome} numberOfLines={1}>{item.nome}</Text>
                {item.linha1 ? <Text style={styles.detalhe} numberOfLines={1}>{item.linha1}</Text> : null}
                {item.linha2 ? <Text style={styles.detalhe} numberOfLines={1}>{item.linha2}</Text> : null}
              </View>
              <Ionicons name="chevron-forward" size={20 * scale} color="#9b9b9b" />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

function createStyles(scale, isSmallDevice, isTablet) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12 * scale,
      paddingHorizontal: isSmallDevice ? 16 : 24,
      paddingTop: 40,
      paddingBottom: 12 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#d1d1d1',
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      borderRadius: 20 * scale,
      paddingHorizontal: 16 * scale,
      paddingVertical: 10 * scale,
    },
    searchInput: { flex: 1, fontSize: 14 * scale, color: '#4a4a4a', padding: 0 },
    lista: {
      paddingHorizontal: isSmallDevice ? 16 : 24,
      paddingTop: 14 * scale,
      paddingBottom: 30 * scale,
      maxWidth: isTablet ? 520 : '100%',
      width: '100%',
      alignSelf: 'center',
    },
    contagem: { fontSize: 13 * scale, color: '#6f6f6f', marginBottom: 10 * scale },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12 * scale,
      paddingVertical: 12 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#e6e6e6',
    },
    foto: { width: 48 * scale, height: 48 * scale, borderRadius: 24 * scale },
    nome: { fontSize: 16 * scale, fontWeight: '700', color: '#3a3a3a' },
    detalhe: { fontSize: 13 * scale, color: '#6f6f6f' },
    vazio: { textAlign: 'center', color: '#6f6f6f', marginTop: 40, paddingHorizontal: 24, fontSize: 14 * scale },
  });
}