import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './screens/home'
import LoginUsuario from './screens/loginUsuario'
import CadastroUsuario from './screens/cadastroUsuario'

const Stack = createNativeStackNavigator();

export default function App() {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Home'>
        <Stack.Screen
        name='Home'
        component={Home}
        options={{headerShown: false}}
        />

        <Stack.Screen
        name='LoginUsuario'
        component={LoginUsuario}
        options={{headerShown:false}}
        />

        <Stack.Screen
        name='CadastroUsuario'
        component={CadastroUsuario}
        options={{headerShown:false}}
        />

      </Stack.Navigator>

    </NavigationContainer>


    
  );
}
;