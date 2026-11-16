import { Text, TouchableOpacity } from 'react-native';

// Campo da barra de pesquisa: ao tocar, abre a tela de busca (candidatos <-> empresas).
// Use no lugar do <TextInput> dentro de cada barra: <BarraPesquisaCampo navigation={navigation} style={styles.searchInput} />
export default function BarraPesquisaCampo({ navigation, style }) {
  return (
    <TouchableOpacity
      style={{ flex: 1 }}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('Busca')}
      accessibilityRole="search"
      accessibilityLabel="Pesquisar. Toque para abrir a busca"
      hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}>
      <Text style={[style, { color: '#9b9b9b' }]} numberOfLines={1}>
        Pesquisar
      </Text>
    </TouchableOpacity>
  );
}