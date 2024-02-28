import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {
  HomeActiveIcon,
  HomeIcon,
  ProfileActiveIcon,
  ProfileIcon,
} from '../assets/icons';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import {colors} from '../styles/theme';
import {Image} from 'react-native';

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.background.dark,
          borderTopColor: colors.background.main,
        },
        title: '',
        tabBarIcon: ({focused}) => {
          let icon;
          if (route.name === 'Home') {
            icon = focused ? HomeActiveIcon : HomeIcon;
          } else if (route.name === 'Profile') {
            icon = focused ? ProfileActiveIcon : ProfileIcon;
          }

          // You can return any component that you like here!
          return <Image source={icon} style={{height: 20, width: 20}} alt="" />;
        },
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
};

export default BottomTabs;
