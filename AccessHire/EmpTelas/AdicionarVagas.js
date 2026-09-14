import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  SafeAreaView, ScrollView, ActivityIndicator, StatusBar,
} from 'react-native';
import { createJob } from '../services/jobs';

const RECURSOS_ACESSIBILIDADE = [
  'Acesso para cadeira de rodas', 'Intérprete de Libras',
  'Compatível com leitor de tela', 'Horário flexível',
  'Trabalho remoto', 'Pausas adicionais', 'Outro',
];

export default function AdicionarVagas({ route, navigation }) {
  const { companyId } = route.params;
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [localTrabalho, setLocalTrabalho] = useState('');
  const [recursos, setRecursos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function toggleRecurso(item) {
    setRecursos((prev) =>
      prev.includes(item) ? prev.filter((r) => r !== item) : [...prev, item]
    );
  }

  async function handleSalvar() {
    setError('');
    if (!titulo || !descricao || !localTrabalho) {
      setError('Preenche título, descrição e local de trabalho.');
      return;
    }

    setLoading(true);
    try {
      await createJob({
        companyId,
        titulo,
        descricao,
        localTrabalho,
        reqAcessibilidade: recursos,
      });
      navigation.navigate('VagasEmp', { companyId });
    } catch (e) {
      setError('Erro ao publicar vaga. Tenta de novo.');
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Nova vaga</Text>

        <Text style={styles.label}>Título da vaga *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Desenvolvedor(a) Júnior"
          value={titulo}
          onChangeText={setTitulo}
        />

        <Text style={styles.label}>Descrição / requisitos *</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Descreva a vaga, requisitos e responsabilidades"
          value={descricao}
          onChangeText={setDescricao}
          multiline
        />

        <Text style={styles.label}>Local de trabalho *</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Remoto, ou São Paulo - SP"
          value={localTrabalho}
          onChangeText={setLocalTrabalho}
        />

        <Text style={styles.label}>Recursos de acessibilidade oferecidos</Text>
        <View style={styles.chipsContainer}>
          {RECURSOS_ACESSIBILIDADE.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.chip, recursos.includes(item) && styles.chipSelected]}
              onPress={() => toggleRecurso(item)}>
              <Text style={[styles.chipText, recursos.includes(item) && styles.chipTextSelected]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSalvar} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Publicar vaga</Text>}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#4a4a4a', marginBottom: 20 },
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
  chipSelected: { backgroundColor: '#45c5f3', borderColor: '#45c5f3' },
  chipText: { color: '#4a4a4a', fontSize: 13 },
  chipTextSelected: { color: '#fff', fontWeight: '700' },
  error: { color: 'red', marginTop: 14 },
  button: {
    backgroundColor: '#45c5f3', borderRadius: 12, paddingVertical: 16,
    alignItems: 'center', marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});