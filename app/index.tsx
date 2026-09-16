import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Telas EmpTelas
import AdicionarVagas from '../EmpTelas/AdicionarVagas';
import CadastroEmp from '../EmpTelas/CadastroEmp';
import ConfigEmp from '../EmpTelas/ConfigEmp';
import Interessados from '../EmpTelas/Interessados';
import LoginEmp from '../EmpTelas/LoginEmp';
import MenuEmp from '../EmpTelas/MenuEmp';
import OnboardingEmp from '../EmpTelas/OnboardingEmp';
import VagasEmp from '../EmpTelas/VagasEmp';

// Telas screens
import Acessibilidade from '../screens/Acessibilidade';
import Chat from '../screens/Chat';
import Conversas from '../screens/Conversa';
import Dados from '../screens/Dados';
import Home from '../screens/Home';
import SobreNos from '../screens/SobreNos';

// Telas UserTelas
import CadastroUser from '../UserTelas/cadastroUser';
import ConfigUser from '../UserTelas/ConfigUser';
import LoginUser from '../UserTelas/loginUser';
import MenuUser from '../UserTelas/MenuUser';
import OnboardingUser from '../UserTelas/OnboardingUser';
import SegurancaUser from '../UserTelas/SegurancaUser';
import VagasUser from '../UserTelas/VagasUser';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
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

          {/* Empresa */}
          <Stack.Screen name="LoginEmp" component={LoginEmp} />
          <Stack.Screen name="CadastroEmp" component={CadastroEmp} />
          <Stack.Screen name="MenuEmp" component={MenuEmp} />
          <Stack.Screen name="ConfigEmp" component={ConfigEmp} />
          <Stack.Screen name="OnboardingEmp" component={OnboardingEmp} />
          <Stack.Screen name="AdicionarVagas" component={AdicionarVagas} />
          <Stack.Screen name="VagasEmp" component={VagasEmp} />
          <Stack.Screen name="Interessados" component={Interessados} />

          {/* Outras telas */}
          <Stack.Screen name="Dados" component={Dados} />
          <Stack.Screen name="Acessibilidade" component={Acessibilidade} />
          <Stack.Screen name="SobreNos" component={SobreNos} />

          {/* Chat e Conversas */}
          <Stack.Screen name="Chat" component={Chat} />
          <Stack.Screen name="Conversas" component={Conversas} />

        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}