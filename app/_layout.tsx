import { NavigationIndependentTree } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import LoginUser from '../UserTelas/loginUser';
import CadastroUser from '../UserTelas/cadastroUser';
import LoginEmp from '../EmpTelas/LoginEmp';
import CadastroEmp from '../EmpTelas/CadastroEmp';

const Stack = createNativeStackNavigator();

export default function RootLayout() {
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="LoginUser" component={LoginUser} />
          <Stack.Screen name="CadastroUser" component={CadastroUser} />
          <Stack.Screen name="LoginEmp" component={LoginEmp} />
          <Stack.Screen name="CadastroEmp" component={CadastroEmp} />
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
}