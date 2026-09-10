import { NavigationIndependentTree } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import LoginUser from '../UserTelas/loginUser';
import CadastroUser from '../UserTelas/cadastroUser';
import LoginEmp from '../EmpTelas/LoginEmp';
import CadastroEmp from '../EmpTelas/CadastroEmp';
import MenuEmp from '../EmpTelas/MenuEmp';
import MenuUser from '../UserTelas/MenuUser';
import Notificacoes from '../screens/Notificacoes';
import PerfilUser from '../UserTelas/PerfilUser';
import VagasUser from '../UserTelas/VagasUser';
import Chat from '../screens/Chat';
import ConfigUser from '../UserTelas/ConfigUser';
import ConfigEmp from '../EmpTelas/ConfigEmp';
import SegurancaUser from '../UserTelas/SegurancaUser';
import Dados from '../screens/Dados';
import Acessibilidade from '../screens/Acessibilidade';
import SobreNos from '../screens/SobreNos';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="LoginUser" component={LoginUser} />
          <Stack.Screen name="CadastroUser" component={CadastroUser} />
          <Stack.Screen name="MenuUser" component={MenuUser} />
          <Stack.Screen name="LoginEmp" component={LoginEmp} />
          <Stack.Screen name="CadastroEmp" component={CadastroEmp} />
          <Stack.Screen name="MenuEmp" component={MenuEmp} />
          <Stack.Screen name="ConfigUser" component={ConfigUser} />
          <Stack.Screen name="ConfigEmp" component={ConfigEmp} />
          <Stack.Screen name="SegurancaUser" component={SegurancaUser} />
          <Stack.Screen name="Dados" component={Dados} />
          <Stack.Screen name="Acessibilidade" component={Acessibilidade} />
          <Stack.Screen name="SobreNos" component={SobreNos} />
          <Stack.Screen name="Notificacoes" component={Notificacoes}/>
          <Stack.Screen name="PerfilUser" component={PerfilUser} />
          <Stack.Screen name="VagasUser" component={VagasUser} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}