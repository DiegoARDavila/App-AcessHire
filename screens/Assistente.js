// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  carregarHistorico,
  limparHistorico,
  perguntarAssistente,
  salvarHistorico,
} from '../services/assistente';
import { getUserRole } from '../services/auth';
import { auth } from '../services/firebase';

const SUGESTOES = {
  candidate: [
    'Quero simular uma entrevista de emprego',
    'Como posso melhorar meu currículo?',
    'Como me preparar para uma entrevista?',
    'Como falar sobre minha deficiência na seleção?',
  ],
  company: [
    'Me ajude a escrever uma vaga inclusiva',
    'Sugira perguntas para uma entrevista',
    'Como tornar meu processo seletivo acessível?',
    'Como funciona a Lei de Cotas?',
  ],
};

export default function Assistente({ navigation }) {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet);

  const uid = auth.currentUser?.uid;
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [perfil, setPerfil] = useState('candidate');
  const [pronto, setPronto] = useState(false);
  const scrollRef = useRef();

  useEffect(() => {
    if (!uid) return;
    carregarHistorico(uid).then((lista) => {
      setMensagens(lista);
      setPronto(true);
    });
    getUserRole(uid).then((role) => setPerfil(role === 'company' ? 'company' : 'candidate'));
  }, [uid]);

  const ultimaEhDoUsuario = mensagens.length > 0 && mensagens[mensagens.length - 1].role === 'user';

  async function responder(lista) {
    setEnviando(true);
    setErro('');
    try {
      const resposta = await perguntarAssistente(uid, lista);
      const completa = [
        ...lista,
        { id: `${Date.now()}-a`, role: 'assistant', text: resposta },
      ];
      setMensagens(completa);
      salvarHistorico(uid, completa);
    } catch (e) {
      setErro(e?.message || 'Não foi possível falar com o assistente agora.');
    } finally {
      setEnviando(false);
    }
  }

  function enviar(textoDireto) {
    const conteudo = (typeof textoDireto === 'string' ? textoDireto : texto).trim();
    if (!conteudo || enviando || !uid) return;
    setTexto('');
    const nova = { id: `${Date.now()}-u`, role: 'user', text: conteudo.slice(0, 2000) };
    const lista = [...mensagens, nova];
    setMensagens(lista);
    salvarHistorico(uid, lista);
    responder(lista);
  }

  function confirmarLimpar() {
    Alert.alert('Limpar conversa', 'Apagar todo o histórico da conversa com o assistente?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Apagar',
        style: 'destructive',
        onPress: async () => {
          await limparHistorico(uid);
          setMensagens([]);
          setErro('');
        },
      },
    ]);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          accessibilityRole="button"
          accessibilityLabel="Voltar">
          <Ionicons name="arrow-back" size={22 * scale} color="#4a4a4a" />
        </TouchableOpacity>
        <View style={styles.avatar}>
          <Ionicons name="sparkles" size={22 * scale} color="#ffffff" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>Assistente AccessHire</Text>
          <Text style={styles.subtitulo}>Inteligência artificial</Text>
        </View>
        {mensagens.length > 0 && (
          <TouchableOpacity
            onPress={confirmarLimpar}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Limpar conversa">
            <Ionicons name="trash-outline" size={22 * scale} color="#4a4a4a" />
          </TouchableOpacity>
        )}
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          ref={scrollRef}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          contentContainerStyle={styles.conteudo}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <Text style={styles.aviso}>
            Sou uma inteligência artificial e posso errar. Não compartilhe CPF, laudos médicos ou senhas.
          </Text>

          {pronto && mensagens.length === 0 && (
            <>
              <View style={styles.ladoAssistente}>
                <View style={styles.balaoAssistente}>
                  <Text style={styles.textoMensagem}>
                    {perfil === 'company'
                      ? 'Olá! Sou o Assistente AccessHire. Posso ajudar a escrever vagas inclusivas, preparar entrevistas e tornar sua seleção mais acessível. Como posso ajudar?'
                      : 'Olá! Sou o Assistente AccessHire. Posso dar dicas de emprego, ajudar com seu currículo e simular entrevistas com você. Como posso ajudar?'}
                  </Text>
                </View>
              </View>
              <View style={styles.sugestoes}>
                {SUGESTOES[perfil].map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={styles.sugestao}
                    onPress={() => enviar(s)}
                    accessibilityRole="button">
                    <Text style={styles.sugestaoTexto}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          {mensagens.map((msg) => (
            <View
              key={msg.id}
              style={msg.role === 'user' ? styles.ladoUsuario : styles.ladoAssistente}>
              <View style={msg.role === 'user' ? styles.balaoUsuario : styles.balaoAssistente}>
                <Text style={styles.textoMensagem} selectable>
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}

          {enviando && (
            <View style={styles.ladoAssistente}>
              <View style={[styles.balaoAssistente, styles.digitando]}>
                <ActivityIndicator color="#ffffff" />
                <Text style={styles.textoMensagem}>Pensando...</Text>
              </View>
            </View>
          )}

          {!enviando && (erro !== '' || ultimaEhDoUsuario) && (
            <View style={styles.caixaErro}>
              <Text style={styles.textoErro}>
                {erro || 'A última mensagem ainda não foi respondida.'}
              </Text>
              <TouchableOpacity
                style={styles.botaoTentar}
                onPress={() => responder(mensagens)}
                accessibilityRole="button">
                <Text style={styles.botaoTentarTexto}>Tentar de novo</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.enviar}>
          <TextInput
            style={styles.input}
            placeholder="Pergunte ao assistente"
            placeholderTextColor="#9b9b9b"
            value={texto}
            onChangeText={setTexto}
            multiline
            maxLength={1000}
            accessibilityLabel="Mensagem para o assistente"
          />
          <TouchableOpacity
            onPress={() => enviar()}
            disabled={enviando || !texto.trim()}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel="Enviar mensagem">
            <Ionicons
              name="send-outline"
              size={24 * scale}
              color={enviando || !texto.trim() ? '#b0b0b0' : '#00C0E8'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(scale, isSmallDevice, isTablet) {
  const lateral = isSmallDevice ? 16 : 24;
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10 * scale,
      paddingHorizontal: lateral,
      paddingTop: 40,
      paddingBottom: 12 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#d1d1d1',
    },
    avatar: {
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 22 * scale,
      backgroundColor: '#45c5f3',
      alignItems: 'center',
      justifyContent: 'center',
    },
    titulo: { fontSize: 17 * scale, fontWeight: '800', color: '#3a3a3a' },
    subtitulo: { fontSize: 12 * scale, color: '#6f6f6f' },
    conteudo: {
      paddingHorizontal: lateral,
      paddingTop: 16 * scale,
      paddingBottom: 16 * scale,
      maxWidth: isTablet ? 520 : '100%',
      width: '100%',
      alignSelf: 'center',
    },
    aviso: {
      fontSize: 12 * scale,
      color: '#6f6f6f',
      textAlign: 'center',
      marginBottom: 16 * scale,
    },
    ladoUsuario: { alignItems: 'flex-end' },
    ladoAssistente: { alignItems: 'flex-start' },
    balaoUsuario: {
      padding: 10 * scale,
      backgroundColor: '#00C0E8',
      maxWidth: '80%',
      borderBottomStartRadius: 20 * scale,
      borderTopStartRadius: 20 * scale,
      borderTopEndRadius: 20 * scale,
      marginVertical: 2 * scale,
    },
    balaoAssistente: {
      padding: 10 * scale,
      backgroundColor: '#6D6D6D',
      maxWidth: '85%',
      borderBottomEndRadius: 20 * scale,
      borderTopStartRadius: 20 * scale,
      borderTopEndRadius: 20 * scale,
      marginVertical: 2 * scale,
    },
    digitando: { flexDirection: 'row', alignItems: 'center', gap: 10 * scale },
    textoMensagem: { color: '#ffffff', fontSize: 15 * scale },
    sugestoes: { marginTop: 12 * scale, gap: 8 * scale },
    sugestao: {
      borderWidth: 1,
      borderColor: '#45c5f3',
      borderRadius: 16 * scale,
      paddingVertical: 10 * scale,
      paddingHorizontal: 14 * scale,
    },
    sugestaoTexto: { color: '#2c8bc4', fontSize: 14 * scale },
    caixaErro: {
      borderWidth: 1,
      borderColor: '#d9534f',
      borderRadius: 12 * scale,
      padding: 12 * scale,
      marginTop: 12 * scale,
    },
    textoErro: { color: '#a94442', fontSize: 14 * scale },
    botaoTentar: {
      backgroundColor: '#45c5f3',
      borderRadius: 10 * scale,
      paddingVertical: 10 * scale,
      alignItems: 'center',
      marginTop: 10 * scale,
    },
    botaoTentarTexto: { color: '#ffffff', fontWeight: '700', fontSize: 14 * scale },
    enviar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#ffffff',
      borderColor: '#00C0E8',
      borderWidth: 2,
      borderRadius: 10,
      marginHorizontal: lateral,
      marginBottom: 20,
      paddingHorizontal: 10,
    },
    input: {
      flex: 1,
      maxHeight: 120 * scale,
      paddingVertical: 12 * scale,
      paddingHorizontal: 10 * scale,
      fontSize: 15 * scale,
      color: '#3a3a3a',
    },
  });
}