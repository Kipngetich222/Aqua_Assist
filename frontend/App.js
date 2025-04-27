import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NAVIGATION, THEME } from './constants/config';

// Import screens
import Dashboard from './screens/Dashboard';
import DataEntry from './screens/DataEntry';
import DiseaseScanner from './screens/DiseaseScanner';
import Chatbot from './screens/Chatbot';
import Settings from './screens/Settings';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={NAVIGATION.initialRoute}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const routeConfig = NAVIGATION.routes.find(
              (r) => r.name === route.name
            );
            return (
              <Ionicons
                name={focused ? routeConfig.icon : `${routeConfig.icon}-outline`}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: THEME.colors.primary,
          tabBarInactiveTintColor: THEME.colors.textLight,
          tabBarStyle: {
            backgroundColor: 'white',
            borderTopWidth: 1,
            borderTopColor: THEME.colors.border,
            paddingBottom: 5,
            paddingTop: 5,
          },
          headerStyle: {
            backgroundColor: THEME.colors.primary,
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}>
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            title: 'Dashboard',
          }}
        />
        <Tab.Screen
          name="DataEntry"
          component={DataEntry}
          options={{
            title: 'Data Entry',
          }}
        />
        <Tab.Screen
          name="DiseaseScanner"
          component={DiseaseScanner}
          options={{
            title: 'Disease Scanner',
          }}
        />
        <Tab.Screen
          name="Chatbot"
          component={Chatbot}
          options={{
            title: 'Chatbot',
          }}
        />
        <Tab.Screen
          name="Settings"
          component={Settings}
          options={{
            title: 'Settings',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
