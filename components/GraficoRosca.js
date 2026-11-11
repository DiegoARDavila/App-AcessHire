import { StyleSheet, Text, View } from 'react-native';

// Gráfico de rosca (donut) feito só com Views, sem precisar instalar react-native-svg.
// valor: 0 a 100. As duas metades do anel são recortadas e giradas para formar o arco.
export default function GraficoRosca({
  valor = 0,
  tamanho = 100,
  espessura = 12,
  corProgresso = '#6b9cff',
  corFundo = '#c9c9c9',
  corTexto = '#000000',
  rotulo,
}) {
  const v = Math.max(0, Math.min(100, Number.isFinite(valor) ? valor : 0));
  const angulo = v * 3.6;
  const metade = tamanho / 2;

  const anel = (extra) => ({
    position: 'absolute',
    top: 0,
    width: tamanho,
    height: tamanho,
    borderRadius: metade,
    borderWidth: espessura,
    borderColor: 'transparent',
    borderTopColor: corProgresso,
    borderRightColor: corProgresso,
    ...extra,
  });

  return (
    <View
      style={{ width: tamanho, height: tamanho }}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={rotulo ?? `${Math.round(v)}% concluído`}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(v) }}>
      {/* trilho de fundo */}
      <View
        style={{
          position: 'absolute',
          width: tamanho,
          height: tamanho,
          borderRadius: metade,
          borderWidth: espessura,
          borderColor: corFundo,
        }}
      />

      {/* primeira metade (0° a 180°) */}
      {v > 0 && (
        <View style={[styles.recorte, { left: metade, width: metade, height: tamanho }]}>
          <View
            style={anel({
              left: -metade,
              transform: [{ rotate: `${Math.min(angulo, 180) - 135}deg` }],
            })}
          />
        </View>
      )}

      {/* segunda metade (180° a 360°) */}
      {angulo > 180 && (
        <View style={[styles.recorte, { left: 0, width: metade, height: tamanho }]}>
          <View
            style={anel({
              left: 0,
              transform: [{ rotate: `${angulo - 135}deg` }],
            })}
          />
        </View>
      )}

      <View style={styles.centro} pointerEvents="none">
        <Text style={{ fontSize: tamanho * 0.2, color: corTexto, fontWeight: '500' }}>
          {Math.round(v)}%
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  recorte: { position: 'absolute', top: 0, overflow: 'hidden' },
  centro: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});