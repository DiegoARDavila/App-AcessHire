import { useRef, useState } from 'react';
import { Switch } from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  StatusBar,
  ScrollView,
  PanResponder,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const opcoesFonte = ['Pequena', 'Média', 'Grande'];
const previewSizes = [13, 17, 22];
const totalSteps = opcoesFonte.length - 1;

export default function DadosUser({ navigation }) {
  const { width } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);

  const styles = createStyles(scale, isSmallDevice, isTablet);

  const [aCativo, setACativo] = useState(false);
  const [lTativo, setLTativo] = useState(false);
  const [fontStep, setFontStep] = useState(1);
  const trackWidthRef = useRef(0);
  const [trackWidthForRender, setTrackWidthForRender] = useState(0);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const thumbSize = 22 * scale;

  const updateStepFromX = (x: number) => {
    const currentTrackWidth = trackWidthRef.current;
    if (currentTrackWidth <= 0) return;
    const ratio = Math.min(Math.max(x / currentTrackWidth, 0), 1);
    setFontStep(Math.round(ratio * totalSteps));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderGrant: (evt) => {
        setScrollEnabled(false);
        updateStepFromX(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        updateStepFromX(evt.nativeEvent.locationX);
      },
      onPanResponderRelease: () => setScrollEnabled(true),
      onPanResponderTerminate: () => setScrollEnabled(true),
    })
  ).current;

  const thumbPositionRatio =
    trackWidthForRender > 0 ? fontStep / totalSteps : 0;
  const thumbLeft = thumbPositionRatio * trackWidthForRender - thumbSize / 2;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ConfigUser')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={styles.backIcon}>
          <Ionicons name="arrow-back" size={22 * scale} color="#4a4a4a" />
        </TouchableOpacity>
        <View style={styles.topBarContent}>
          <Text style={styles.topBarTitle}>Configurações</Text>
          <Text style={styles.topBarSubtitle}>Acessibilidade</Text>
        </View>
        <View style={styles.backIconSpacer} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        scrollEnabled={scrollEnabled}>
        <View style={styles.cardConfig}>
          <View style={styles.topLineFont}>
            <Ionicons name="text-outline" size={22 * scale} color="#45c5f3" />
            <Text style={styles.titleFont}>Tamanho atual da fonte</Text>
          </View>

          <View
            style={styles.sliderTouchArea}
            onLayout={(e) => {
              const measuredWidth = e.nativeEvent.layout.width;
              trackWidthRef.current = measuredWidth;
              setTrackWidthForRender(measuredWidth);
            }}
            {...panResponder.panHandlers}>
            <View style={styles.track}>
              <View
                style={[
                  styles.trackFilled,
                  { width: Math.max(0, thumbLeft + thumbSize / 2) },
                ]}
              />
            </View>
            <View
              style={[
                styles.thumb,
                {
                  width: thumbSize,
                  height: thumbSize,
                  borderRadius: thumbSize / 2,
                  left: thumbLeft,
                },
              ]}
            />
          </View>

          <View style={styles.labelsRow}>
            {opcoesFonte.map((label, index) => (
              <Text
                key={label}
                style={[
                  styles.labelText,
                  fontStep === index && styles.labelTextActive,
                ]}>
                {label}
              </Text>
            ))}
          </View>

          <Text style={styles.previaLabel}>Prévia:</Text>
          <View style={styles.previaBox}>
            <Text
              style={[
                styles.previaText,
                { fontSize: previewSizes[fontStep] * scale },
              ]}>
              ABCabc123!@#
            </Text>
          </View>
        </View>
        <View style={styles.cardConfig2}>
          <Ionicons
            name="color-fill-outline"
            size={30 * scale}
            color="#45c5f3"
          />
          <Text style={styles.titleFont}>Alto Contraste</Text>
          <Switch
            value={aCativo}
            onValueChange={setACativo}
            trackColor={{ false: '#d9d9d9', true: '#54c3ea' }}
            thumbColor="#ffffff"
          />
        </View>
        <View style={styles.cardConfig2}>
          <Ionicons
            name="volume-medium-outline"
            size={30 * scale}
            color="#45c5f3"
          />
          <Text style={styles.titleFont}t>Leitor de Telas</Text>
          <Switch
            value={lTativo}
            onValueChange={setLTativo}
            trackColor={{ false: '#d9d9d9', true: '#54c3ea' }}
            thumbColor="#ffffff"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(
  scale: number,
  isSmallDevice: boolean,
  isTablet: boolean
) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: isSmallDevice ? 16 : 24,
      height: 90 * scale,
      paddingTop: 36 * scale,
      paddingBottom: 15 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#d1d1d1',
    },
    backIcon: {
      width: 22 * scale,
    },
    backIconSpacer: {
      width: 22 * scale,
    },
    topBarContent: {
      flexDirection: 'column',
      gap: 1 * scale,
    },
    topBarTitle: {
      flex: 1,
      textAlign: 'center',
      fontSize: 15 * scale,
      fontWeight: '700',
      color: '#3a3a3a',
    },
    topBarSubtitle: {
      fontSize: 12 * scale,
      textAlign: 'center',
    },
    scrollContent: {
      padding: 30 * scale,
    },
    cardConfig: {
      marginVertical: 10 * scale,
      padding: 16 * scale,
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#45c5f3',
      borderRadius: 10,
    },
    cardConfig2: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      gap: 20 * scale,
      alignItems: 'center',
      marginVertical: 10 * scale,
      padding: 16 * scale,
      backgroundColor: '#fff',
      borderWidth: 2,
      borderColor: '#45c5f3',
      borderRadius: 10,
    },
    topLineFont: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18 * scale,
    },
    titleFont: {
      fontSize: 15 * scale,
      color: '#3a3a3a',
      fontWeight: '800',
      marginLeft: 10 * scale,
    },
    sliderTouchArea: {
      width: '100%',
      height: 40 * scale,
      justifyContent: 'center',
    },
    track: {
      height: 4 * scale,
      borderRadius: 2 * scale,
      backgroundColor: '#d9d9d9',
      width: '100%',
    },
    trackFilled: {
      height: 4 * scale,
      borderRadius: 2 * scale,
      backgroundColor: '#4a4a4a',
      position: 'absolute',
      left: 0,
      top: 0,
    },
    thumb: {
      position: 'absolute',
      backgroundColor: '#4a4a4a',
      top: '50%',
      marginTop: -11 * scale,
    },
    labelsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10 * scale,
      marginBottom: 20 * scale,
    },
    labelText: {
      fontSize: 12 * scale,
      color: '#9b9b9b',
      fontWeight: '600',
    },
    labelTextActive: {
      color: '#3a3a3a',
      fontWeight: '800',
    },
    previaLabel: {
      fontSize: 15 * scale,
      color: '#3a3a3a',
      fontWeight: '700',
      marginBottom: 10 * scale,
    },
    previaBox: {
      borderBottomWidth: 1 * scale,
      borderBottomColor: '#45c5f3',
      alignItems: 'center',
      paddingBottom: 8 * scale,
    },
    previaText: {
      fontWeight: '800',
      color: '#3a3a3a',
      letterSpacing: 1,
    },
  });
}
