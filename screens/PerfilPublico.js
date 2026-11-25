import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
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
import { getProfile } from '../services/auth';
import { ensureConversation } from '../services/chat';
import { auth } from '../services/firebase';
import { listenCompanyJobs } from '../services/jobs';

// route.params: { tipo: 'candidate' | 'company', id }
// Perfil somente leitura. Não mostra telefone, data de nascimento nem dados de saúde/laudo.
export default function PerfilPublico({ route, navigation }) {
  const { tipo, id } = route.params;
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet);

  const [perfil, setPerfil] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [abrindo, setAbrindo] = useState(false);
  const [vagas, setVagas] = useState([]);

  const empresa = tipo === 'company';

  useEffect(() => {
    getProfile(id, tipo)
      .then(setPerfil)
      .catch((e) => console.log('Erro ao carregar perfil:', e))
      .finally(() => setCarregando(false));
  }, [id, tipo]);

  useEffect(() => {
    if (!empresa) return;
    const off = listenCompanyJobs(id, setVagas);
    return () => off();
  }, [empresa, id]);

  async function conversar() {
    const meuUid = auth.currentUser?.uid;
    if (!meuUid || abrindo) return;
    setAbrindo(true);
    try {
      const candidatoUid = empresa ? meuUid : id;
      const empresaId = empresa ? id : meuUid;
      const conversationId = await ensureConversation(candidatoUid, empresaId);
      navigation.navigate('Conversas', {
        conversationId,
        outroNome: nome,
        outroUid: id,
        outroTipo: tipo,
      });
    } catch (e) {
      console.log('Erro ao abrir conversa:', e);
      Alert.alert('Ops', 'Não foi possível abrir a conversa agora. Tente de novo.');
    } finally {
      setAbrindo(false);
    }
  }

  const nome = empresa ? perfil?.nomeEmpresa ?? 'Empresa' : perfil?.nome ?? 'Candidato';

  const campos = empresa
    ? [
        ['Setor', perfil?.setor],
        ['Porte', perfil?.porte],
        ['Sede', perfil?.sede],
        ['Fundação', perfil?.anoFundacao],
      ]
    : [
        ['Área de atuação', perfil?.areaAtuacao],
        ['Formação', perfil?.formacao],
      ];
  const texto = empresa ? perfil?.descricao : perfil?.sobre;

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
        <Text style={styles.topTitulo}>{empresa ? 'Perfil da empresa' : 'Perfil do candidato'}</Text>
        <View style={{ width: 22 * scale }} />
      </View>

      {carregando ? (
        <ActivityIndicator style={{ marginTop: 40 }} color="#45c5f3" />
      ) : !perfil ? (
        <Text style={styles.vazio}>Perfil não encontrado.</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.conteudo}>
          <View style={styles.cabecalho}>
            <Image source={require('../assets/UserPhotoEX.png')} style={styles.foto} />
            <Text style={styles.nome}>{nome}</Text>
          </View>

          {campos.map(([rotulo, valor]) =>
            valor ? (
              <View key={rotulo} style={styles.campo}>
                <Text style={styles.rotulo}>{rotulo}</Text>
                <Text style={styles.valor}>{String(valor)}</Text>
              </View>
            ) : null
          )}

          {empresa && perfil.site ? (
            <View style={styles.campo}>
              <Text style={styles.rotulo}>Site</Text>
              <Text
                style={[styles.valor, { color: '#1787d5' }]}
                accessibilityRole="link"
                onPress={() => {
                  const url = /^https?:\/\//i.test(perfil.site) ? perfil.site : `https://${perfil.site}`;
                  Linking.openURL(url).catch(() => {});
                }}>
                {perfil.site}
              </Text>
            </View>
          ) : null}

          {texto ? (
            <View style={styles.campo}>
              <Text style={styles.rotulo}>{empresa ? 'Sobre a empresa' : 'Sobre'}</Text>
              <Text style={styles.valor}>{texto}</Text>
            </View>
          ) : null}

          {empresa && vagas.length > 0 && (
            <View style={styles.campo}>
              <Text style={styles.rotulo}>Vagas publicadas</Text>
              {vagas.map((v) => (
                <Text key={v.id} style={styles.valor}>
                  {'•'} {v.titulo}
                  {v.localTrabalho ? ` (${v.localTrabalho})` : ''}
                </Text>
              ))}
            </View>
          )}

          <TouchableOpacity
            style={styles.botao}
            onPress={conversar}
            disabled={abrindo}
            accessibilityRole="button"
            accessibilityLabel={`Conversar com ${nome}`}>
            {abrindo ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="chatbubble-outline" size={20 * scale} color="#ffffff" />
                <Text style={styles.botaoTexto}>Conversar</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
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
      justifyContent: 'space-between',
      paddingHorizontal: isSmallDevice ? 16 : 24,
      paddingTop: 40,
      paddingBottom: 14 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#d1d1d1',
    },
    topTitulo: { fontSize: 15 * scale, fontWeight: '700', color: '#3a3a3a' },
    conteudo: {
      paddingHorizontal: isSmallDevice ? 16 : 24,
      paddingTop: 24 * scale,
      paddingBottom: 40 * scale,
      maxWidth: isTablet ? 520 : '100%',
      width: '100%',
      alignSelf: 'center',
    },
    cabecalho: { alignItems: 'center', marginBottom: 20 * scale },
    foto: { width: 96 * scale, height: 96 * scale, borderRadius: 48 * scale },
    nome: { fontSize: 22 * scale, fontWeight: '800', color: '#3a3a3a', marginTop: 10 * scale, textAlign: 'center' },
    campo: { marginBottom: 16 * scale },
    rotulo: { fontSize: 12 * scale, fontWeight: '700', color: '#6f6f6f', marginBottom: 2 * scale },
    valor: { fontSize: 15 * scale, color: '#3a3a3a', lineHeight: 21 * scale },
    botao: {
      flexDirection: 'row',
      gap: 8 * scale,
      backgroundColor: '#45c5f3',
      borderRadius: 12 * scale,
      paddingVertical: 14 * scale,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12 * scale,
    },
    botaoTexto: { color: '#ffffff', fontSize: 16 * scale, fontWeight: '700' },
    vazio: { textAlign: 'center', color: '#6f6f6f', marginTop: 40 },
  });
}