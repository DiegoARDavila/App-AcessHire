import React from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {
  Ionicons,
  FontAwesome,
  MaterialCommunityIcons,
} from '@expo/vector-icons';

export default function VagasUser({ navigation, onSearch }) {
  const { width, height } = useWindowDimensions();
  const isSmallDevice = width < 360;
  const isTablet = width >= 768;
  const scale = Math.min(Math.max(width / 320, 0.85), isTablet ? 1.5 : 1.2);

  const styles = createStyles(scale, isSmallDevice, isTablet, width);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Image
            source={require('../assets/UserPhotoEX.png')}
            style={styles.avatar}
          />

          <View style={styles.searchBar}>
            <TextInput
              style={styles.searchInput}
              placeholder="Pesquisar"
              placeholderTextColor="#9b9b9b"
              onChangeText={onSearch}
              accessibilityLabel="Campo de pesquisa"
            />
            <Ionicons name="search" size={18 * scale} color="#9b9b9b" />
          </View>
        </View>
        <View style={styles.content}>
          <View style={styles.filterBar}>
            <TouchableOpacity style={styles.filterBtn}>
              <Text>Recomendadas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}>
              <Text>Salvas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.filterBtn}>
              <Text>Aplicadas</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomNav}>
        <Ionicons 
          name="home" 
          size={24 * scale}  
          color="#6f6f6f" 
          onPress={() => navigation.navigate('MenuUser')}
          />
        <Ionicons 
          name="chatbubble-outline" 
          size={22 * scale} 
          color="#6f6f6f"
          onPress={() => navigation.navigate('Chat')}
          />
        <MaterialCommunityIcons
          name="briefcase-outline"
          size={23 * scale}
          color="#54c3ea"
        />
        <Ionicons
          name="notifications-outline"
          size={23 * scale}
          color="#6f6f6f"
          onPress={() => navigation.navigate('Notificacoes')}
        />
        <Ionicons 
        name="menu" 
        size={24 * scale}
        color="#6f6f6f"
        onPress={() => navigation.navigate('ConfigUser')}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(
  scale: number,
  isSmallDevice: boolean,
  isTablet: boolean,
  width: number
) {
  const maxContentWidth = isTablet ? 520 : '100%';

  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: '#ffffff',
    },
    scrollContent: {
      paddingTop: 40,
      paddingBottom: 24,
      maxWidth: maxContentWidth,
      width: '100%',
      alignSelf: 'center',
    },
    topBar: {
      paddingHorizontal: isSmallDevice ? 16 : 24,
      flexDirection: 'row',
      alignItems: 'center',
      paddingBottom: 12 * scale,
      borderBottomWidth: 1,
      borderBottomColor: '#d1d1d1',
    },
    avatar: {
      width: 44 * scale,
      height: 44 * scale,
      borderRadius: 22 * scale,
    },
    searchBar: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f2f2f2',
      borderRadius: 20 * scale,
      paddingHorizontal: 16 * scale,
      paddingVertical: 10 * scale,
      marginLeft: 12 * scale,
    },
    searchInput: {
      flex: 1,
      fontSize: 14 * scale,
      color: '#4a4a4a',
    },
    content: {
      paddingHorizontal: isSmallDevice ? 16 : 24,
    },
    filterBar: {
      display: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      margin: 15,
    },
    filterBtn: {
      backgroundColor: '#d1d1d1',
      padding: 10,
      borderRadius: 15,
    },
    bottomNav: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#e9e6f2',
      borderRadius: 30 * scale,
      marginHorizontal: isSmallDevice ? 16 : 24,
      marginBottom: 20 * scale,
      paddingVertical: 12 * scale,
    },
  });
}
