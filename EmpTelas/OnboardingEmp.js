import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView, ScrollView,
  StyleSheet,
  Text, TextInput, TouchableOpacity,
  View,
} from 'react-native';
import { completeProfile } from '../services/auth';

const SETORES = [
  'Tecnologia', 'Varejo', 'Saúde', 'Indústria', 'Educação',
  'Financeiro', 'Serviços', 'Construção', 'Logística', 'Outro',
];

const PORTES = ['Pequena (até 49)', 'Média (50 a 499)', 'Grande (500+)'];

export default function OnboardingEmp({ route, navigation }) {
  const { uid } = route.params;
  const [sede, setSede] = useState('');
  const [setor, setSetor] = useState('');
  const [porte, setPorte] = useState('');
  const [anoFundacao, setAnoFundacao] = useState('');
  const [site, setSite] = useState('');
  const [descricao, setDescricao] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleContinuar() {
    setError('');

    if (!sede) {
      setError('Preenche a sede/localização da empresa.');
      return;
    }
    if (!setor) {
      setError('Escolhe o setor de atuação.');
      return;
    }
    if (!porte) {
      setError('Escolhe o porte da empresa.');
      return;
    }

    setLoading(true);
    try {
      await completeProfile(uid, 'company', {
        sede,
        setor,
        porte,
        anoFundacao: anoFundacao || null,
        site: site || null,
        descricao: descricao || null,
      });
      navigation.navigate('MenuEmp', { companyId: uid });
    } catch (e) {
      setError('Erro ao salvar. Tenta de novo.');
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Complete o perfil da empresa</Text>
        <Text style={styles.subtitle}>Isso ajuda candidatos a conhecerem melhor sua empresa</Text>

        <Text style={styles.label}>Sede / Localização *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: São Paulo, SP"
          value={sede}
          onChangeText={setSede}
        />

        <Text style={styles.label}>Setor de atuação *</Text>
        <View style={styles.chipsContainer}>
          {SETORES.map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.chip, setor === s && styles.chipSelected]}
              onPress={() => setSetor(s)}>
              <Text style={[styles.chipText, setor === s && styles.chipTextSelected]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Porte da empresa *</Text>
        <View style={styles.chipsContainer}>
          {PORTES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.chip, porte === p && styles.chipSelected]}
              onPress={() => setPorte(p)}>
              <Text style={[styles.chipText, porte === p && styles.chipTextSelected]}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Ano de fundação (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 2015"
          value={anoFundacao}
          onChangeText={setAnoFundacao}
          keyboardType="numeric"
          maxLength={4}
        />

        <Text style={styles.label}>Site (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="https://..."
          value={site}
          onChangeText={setSite}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Descrição (opcional)</Text>
        <TextInput
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
          placeholder="Conte um pouco sobre a empresa"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleContinuar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Continuar</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#4a4a4a' },
  subtitle: { fontSize: 14, color: '#6f6f6f', marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '700', color: '#6f6f6f', marginTop: 14, marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 10,
    paddingVertical: 12, paddingHorizontal: 14, fontSize: 15, color: '#4a4a4a',
  },
  chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1, borderColor: '#d9d9d9', borderRadius: 20,
    paddingVertical: 8, paddingHorizontal: 14,
  },
  chipSelected: { backgroundColor: '#54c3ea', borderColor: '#54c3ea' },
  chipText: { color: '#4a4a4a', fontSize: 13 },
  chipTextSelected: { color: '#fff', fontWeight: '700' },
  error: { color: 'red', marginTop: 14 },
  button: {
    backgroundColor: '#54c3ea', borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});