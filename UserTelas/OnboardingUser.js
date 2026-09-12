import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { completeProfile } from '../services/auth';
import { formatDataNascimento, isValidDataNascimento } from '../utils/data';

const AREAS = [
  'Tecnologia', 'Administrativo', 'Atendimento ao Cliente', 'Vendas',
  'Marketing', 'Recursos Humanos', 'Financeiro', 'Educação',
  'Saúde', 'Logística', 'Jurídico', 'Outro',
];

export default function OnboardingUser({ route, navigation }) {
  const { uid } = route.params;
  const [dataNascimento, setDataNascimento] = useState('');
  const [areaAtuacao, setAreaAtuacao] = useState('');
  const [telefone, setTelefone] = useState('');
  const [formacao, setFormacao] = useState('');
  const [sobre, setSobre] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleContinuar() {
    setError('');

    if (!isValidDataNascimento(dataNascimento)) {
      setError('Data de nascimento inválida.');
      return;
    }
    if (!areaAtuacao) {
      setError('Escolhe uma área de atuação.');
      return;
    }

    setLoading(true);
    try {
      await completeProfile(uid, 'candidate', {
        dataNascimento,
        areaAtuacao,
        telefone: telefone || null,
        formacao: formacao || null,
        sobre: sobre || null,
      });
      navigation.navigate('MenuUser');
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
        <Text style={styles.title}>Complete seu perfil</Text>
        <Text style={styles.subtitle}>Isso ajuda a encontrar as vagas certas pra você</Text>

        <Text style={styles.label}>Data de nascimento *</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/AAAA"
          value={dataNascimento}
          onChangeText={(text) => setDataNascimento(formatDataNascimento(text))}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Área de atuação *</Text>
        <View style={styles.chipsContainer}>
          {AREAS.map((area) => (
            <TouchableOpacity
              key={area}
              style={[styles.chip, areaAtuacao === area && styles.chipSelected]}
              onPress={() => setAreaAtuacao(area)}>
              <Text style={[styles.chipText, areaAtuacao === area && styles.chipTextSelected]}>
                {area}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Telefone (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="(00) 00000-0000"
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Formação (opcional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: Ensino médio completo, Técnico em..."
          value={formacao}
          onChangeText={setFormacao}
        />

        <Text style={styles.label}>Sobre você (opcional)</Text>
        <TextInput
          style={[styles.input, { height: 90, textAlignVertical: 'top' }]}
          placeholder="Conte um pouco sobre sua experiência e objetivos"
          value={sobre}
          onChangeText={setSobre}
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