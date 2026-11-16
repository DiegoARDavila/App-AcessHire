import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Caixa de seleção com texto. Os "children" são o texto ao lado (pode ter <Text> de link dentro).
export default function AceiteTermos({ marcado, onAlternar, scale = 1, rotulo, children }) {
  return (
    <View style={styles.linha}>
      <TouchableOpacity
        onPress={onAlternar}
        activeOpacity={0.7}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: marcado }}
        accessibilityLabel={rotulo}
        style={[
          styles.caixa,
          { width: 24 * scale, height: 24 * scale, borderRadius: 6 * scale },
          marcado && styles.caixaMarcada,
        ]}>
        {marcado && <Ionicons name="checkmark" size={18 * scale} color="#ffffff" />}
      </TouchableOpacity>
      <Text style={[styles.texto, { fontSize: 12.5 * scale, lineHeight: 18 * scale }]}>{children}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  linha: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, width: '80%', marginBottom: 12 },
  caixa: {
    borderWidth: 2,
    borderColor: '#7c7c7c',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginTop: 1,
  },
  caixaMarcada: { backgroundColor: '#45c5f3', borderColor: '#45c5f3' },
  texto: { flex: 1, color: '#4a4a4a' },
});