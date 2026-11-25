// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
    Image,
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
  getConversation,
  listenConversationMessages,
  outroParticipante,
  sendMessage,
} from '../services/chat';
import { auth } from '../services/firebase';
import { obterPerfilBasico } from '../services/perfis';

export default function Conversa({ route, navigation }) {
  const { conversationId } = route.params;
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);
  const styles = createStyles(scale, isSmallDevice, isTablet, width);

  const uid = auth.currentUser?.uid;
  const [mensagens, setMensagens] = useState([]);
  const [texto, setTexto] = useState('');
  const scrollRef = useRef();

  // quem está do outro lado: usa o que veio da tela anterior e, se faltar, descobre pela conversa
  const [outro, setOutro] = useState({
    uid: route.params.outroUid ?? null,
    tipo: route.params.outroTipo ?? null,
    nome: route.params.outroNome ?? '',
  });

  useEffect(() => {
    const unsubscribe = listenConversationMessages(conversationId, setMensagens);
    return () => unsubscribe();
  }, [conversationId]);

  useEffect(() => {
    let ativo = true;
    async function carregarOutro() {
      let { uid: outroUid, tipo } = outro;
      if (!outroUid || !tipo) {
        const conversa = await getConversation(conversationId).catch(() => null);
        if (!conversa) return;
        ({ uid: outroUid, tipo } = outroParticipante(conversa, uid));
      }
      if (!outroUid) return;
      const perfil = await obterPerfilBasico(outroUid, tipo);
      if (ativo) setOutro({ uid: outroUid, tipo, nome: perfil.nome });
    }
    carregarOutro();
    return () => {
      ativo = false;
    };
    // só roda de novo se trocar de conversa
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, uid]);

  function abrirPerfil() {
    if (!outro.uid || !outro.tipo) return;
    navigation.navigate('PerfilPublico', { tipo: outro.tipo, id: outro.uid });
  }

  async function handleEnviar() {
    if (!texto.trim()) return;
    const textoEnviado = texto;
    setTexto('');
    await sendMessage(conversationId, uid, textoEnviado);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        ref={scrollRef}
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Ionicons
            name="arrow-back"
            size={22 * scale}
            color="#4a4a4a"
            style={styles.backIcon}
            onPress={() => navigation.goBack()}
          />
          <TouchableOpacity
            style={styles.userHeader}
            onPress={abrirPerfil}
            disabled={!outro.uid}
            accessibilityRole="button"
            accessibilityLabel={`Ver perfil de ${outro.nome || 'participante'}`}>
            <Image source={require('../assets/UserPhotoEX.png')} style={styles.avatar} />
            <View>
              <Text style={{ fontSize: 17 * scale, color: '#4a4a4a', fontWeight: '700' }}>
                {outro.nome || (outro.tipo === 'company' ? 'Empresa' : 'Candidato')}
              </Text>
              {outro.uid ? (
                <Text style={{ fontSize: 12 * scale, color: '#00A6C8' }}>Ver perfil</Text>
              ) : null}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {mensagens.map((msg) => (
            <View
              key={msg.id}
              style={msg.senderUid === uid ? styles.userSide : styles.empSide}>
              <View style={msg.senderUid === uid ? styles.userBalloon : styles.empBalloon}>
                <Text style={styles.messageTxt}>{msg.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={styles.sendMessages}>
        <TextInput
          style={styles.input}
          placeholder="Mande uma mensagem"
          placeholderTextColor="#9b9b9b"
          value={texto}
          onChangeText={setTexto}
          onSubmitEditing={handleEnviar}
        />
        <Ionicons
          name="send-outline"
          size={24 * scale}
          color="#00C0E8"
          onPress={handleEnviar}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(scale, isSmallDevice, isTablet, width) {
  const maxContentWidth = isTablet ? 520 : '100%';
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#ffffff' },
    scrollContent: { paddingTop: 40, paddingBottom: 24, maxWidth: maxContentWidth, width: '100%', alignSelf: 'center' },
    topBar: {
      paddingHorizontal: isSmallDevice ? 16 : 24, flexDirection: 'row', alignItems: 'center',
      paddingBottom: 12 * scale, borderBottomWidth: 1, borderBottomColor: '#d1d1d1', gap: 10 * scale,
    },
    avatar: { width: 44 * scale, height: 44 * scale, borderRadius: 22 * scale },
    userHeader: { flexDirection: 'row', alignItems: 'center', gap: 15 * scale },
    content: { paddingTop: 30, paddingBottom: 24, paddingHorizontal: isSmallDevice ? 16 : 24 },
    userBalloon: {
      padding: 10 * scale, backgroundColor: '#00C0E8', maxWidth: '80%',
      borderBottomStartRadius: 20 * scale, borderTopStartRadius: 20 * scale, borderTopEndRadius: 20 * scale,
      marginVertical: 2 * scale, alignSelf: 'flex-end',
    },
    empBalloon: {
      padding: 10 * scale, backgroundColor: '#6D6D6D', maxWidth: '80%',
      borderBottomEndRadius: 20 * scale, borderTopStartRadius: 20 * scale, borderTopEndRadius: 20 * scale,
      marginVertical: 2 * scale, alignSelf: 'flex-start',
    },
    messageTxt: { color: '#fff', fontSize: 15 * scale },
    userSide: { alignItems: 'flex-end' },
    empSide: { alignItems: 'flex-start' },
    input: { flex: 1, paddingVertical: 12 * scale, paddingHorizontal: 10 * scale },
    sendMessages: {
      flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
      borderColor: '#00C0E8', borderWidth: 2, borderRadius: 10,
      marginHorizontal: isSmallDevice ? 16 : 24, marginBottom: 20, paddingHorizontal: 10,
    },
  });
}