// IMPORTANTE: este import precisa ser o primeiro do arquivo (acessibilidade global)
import '../utils/acessibilidadeGlobal';

import {
  NavigationContainer,
  NavigationIndependentTree,
  useNavigationContainerRef,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';

// Telas EmpTelas
import AdicionarVagas from '../EmpTelas/AdicionarVagas';
import CadastroEmp from '../EmpTelas/CadastroEmp';
import CalculoEmp from '../EmpTelas/CalculoEmp';
import ConfigEmp from '../EmpTelas/ConfigEmp';
import Interessados from '../EmpTelas/Interessados';
import LoginEmp from '../EmpTelas/LoginEmp';
import MenuEmp from '../EmpTelas/MenuEmp';
import OnboardingEmp from '../EmpTelas/OnboardingEmp';
import PerfilEmp from '../EmpTelas/PerfilEmp';
import VagasEmp from '../EmpTelas/VagasEmp';

// Telas screens
import Acessibilidade from '../screens/Acessibilidade';
import Chat from '../screens/Chat';
import Conversas from '../screens/Conversa';
import Dados from '../screens/Dados';
import Home from '../screens/Home';
import Notificacoes from '../screens/Notificacoes';
import SobreNos from '../screens/SobreNos';

// Telas UserTelas
import CadastroUser from '../UserTelas/cadastroUser';
import ConfigUser from '../UserTelas/ConfigUser';
import LoginUser from '../UserTelas/loginUser';
import MenuUser from '../UserTelas/MenuUser';
import OnboardingUser from '../UserTelas/OnboardingUser';
import PerfilUser from '../UserTelas/PerfilUser';
import SegurancaUser from '../UserTelas/SegurancaUser';
import VagasUser from '../UserTelas/VagasUser';

import { carregarAcessibilidade, useAcessibilidade } from '../services/acessibilidade';

const Stack = createNativeStackNavigator();

// Nome falado pelo leitor de telas quando a pessoa muda de tela
const NOMES_TELAS: Record<string, string> = {
  Home: 'Tela inicial',
  LoginUser: 'Login do candidato',
  CadastroUser: 'Cadastro do candidato',
  OnboardingUser: 'Complete seu perfil',
  MenuUser: 'Início',
  VagasUser: 'Vagas',
  PerfilUser: 'Seu perfil',
  ConfigUser: 'Configurações',
  SegurancaUser: 'Segurança',
  LoginEmp: 'Login da empresa',
  CadastroEmp: 'Cadastro da empresa',
  OnboardingEmp: 'Complete o perfil da empresa',
  MenuEmp: 'Início',
  VagasEmp: 'Vagas publicadas',
  AdicionarVagas: 'Nova vaga',
  Interessados: 'Interessados na vaga',
  PerfilEmp: 'Perfil da empresa',
  CalculoEmp: 'Lei de cotas',
  ConfigEmp: 'Configurações',
  Dados: 'Privacidade de dados',
  Acessibilidade: 'Acessibilidade',
  SobreNos: 'Sobre nós',
  Notificacoes: 'Notificações',
  Chat: 'Conversas',
  Conversas: 'Conversa',
};

export default function RootLayout() {
  const { fontStep, altoContraste, leitorTelas, feedbackTatil } = useAcessibilidade();
  const [pronto, setPronto] = useState(false);
  const navRef = useNavigationContainerRef();
  const estadoNav = useRef<any>(undefined);
  const rotaAnterior = useRef<string | undefined>(undefined);
  const toqueInicio = useRef<{ x: number; y: number; t: number } | null>(null);

  useEffect(() => {
    carregarAcessibilidade().finally(() => setPronto(true));
  }, []);

  // espera ler as configurações salvas, para o app já abrir com elas aplicadas
  if (!pronto) return null;

  function aoMudarNavegacao(novoEstado: any) {
    estadoNav.current = novoEstado;
    const rota = navRef.getCurrentRoute()?.name;
    if (rota && rota !== rotaAnterior.current) {
      rotaAnterior.current = rota;
      if (leitorTelas) {
        AccessibilityInfo.announceForAccessibility(NOMES_TELAS[rota] ?? rota);
      }
    }
  }

  return (
    <View
      style={{ flex: 1 }}
      onTouchStart={(e) => {
        const { pageX, pageY } = e.nativeEvent;
        toqueInicio.current = { x: pageX, y: pageY, t: Date.now() };
      }}
      onTouchEnd={(e) => {
        const inicio = toqueInicio.current;
        toqueInicio.current = null;
        if (!feedbackTatil || !inicio) return;
        const { pageX, pageY } = e.nativeEvent;
        const moveu = Math.hypot(pageX - inicio.x, pageY - inicio.y) > 12;
        // só vibra em toques rápidos (não ao rolar a tela)
        if (!moveu && Date.now() - inicio.t < 400) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
        }
      }}>
    <NavigationIndependentTree>
      {/* a key recria o app quando fonte/contraste mudam; o initialState mantém a tela atual */}
      <NavigationContainer
        key={`${fontStep}-${altoContraste}`}
        ref={navRef}
        initialState={estadoNav.current}
        onStateChange={aoMudarNavegacao}>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >

          {/* Tela inicial */}
          <Stack.Screen name="Home" component={Home} />

          {/* Usuário */}
          <Stack.Screen name="LoginUser" component={LoginUser} />
          <Stack.Screen name="CadastroUser" component={CadastroUser} />
          <Stack.Screen name="MenuUser" component={MenuUser} />
          <Stack.Screen name="ConfigUser" component={ConfigUser} />
          <Stack.Screen name="SegurancaUser" component={SegurancaUser} />
          <Stack.Screen name="OnboardingUser" component={OnboardingUser} />
          <Stack.Screen name="VagasUser" component={VagasUser} />
          <Stack.Screen name="PerfilUser" component={PerfilUser}/>

          {/* Empresa */}
          <Stack.Screen name="LoginEmp" component={LoginEmp} />
          <Stack.Screen name="CadastroEmp" component={CadastroEmp} />
          <Stack.Screen name="MenuEmp" component={MenuEmp} />
          <Stack.Screen name="ConfigEmp" component={ConfigEmp} />
          <Stack.Screen name="OnboardingEmp" component={OnboardingEmp} />
          <Stack.Screen name="AdicionarVagas" component={AdicionarVagas} />
          <Stack.Screen name="VagasEmp" component={VagasEmp} />
          <Stack.Screen name="Interessados" component={Interessados} />
          <Stack.Screen name="PerfilEmp" component={PerfilEmp}/>
          <Stack.Screen name="CalculoEmp" component={CalculoEmp}/>
          
          {/* Outras telas */}
          <Stack.Screen name="Dados" component={Dados} />
          <Stack.Screen name="Acessibilidade" component={Acessibilidade} />
          <Stack.Screen name="SobreNos" component={SobreNos} />
          <Stack.Screen name="Notificacoes" component={Notificacoes} />

          {/* Chat e Conversas */}
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="Conversas" component={Conversas} />

        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
    </View>
  );
}