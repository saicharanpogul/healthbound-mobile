import {NavigationContainer} from '@react-navigation/native';
import React, {useCallback, useEffect} from 'react';
import {SafeAreaView, StatusBar, useColorScheme} from 'react-native';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ScaledSheet} from 'react-native-size-matters';
import {useDispatch, useSelector} from 'react-redux';
import BottomTabs from './src/components/BottomTabs';
import {navigationRef} from './src/components/RootNavigation';
import {setIsLoggedIn} from './src/rudux/reducers/profile';
import {RootState} from './src/rudux/store';
import Login from './src/screens/Login';
import {colors} from './src/styles/theme';
import {magic} from './src/utils/magic';
import 'react-native-get-random-values';
import {ConvexReactClient, ConvexProvider} from 'convex/react';
import Config from 'react-native-config';

const Stack = createNativeStackNavigator<RootStackParamList>();
const NativeStack = createNativeStackNavigator();

const convex = new ConvexReactClient(Config.CONVEX_URL as string);

const NativeStackScreens = () => {
  return (
    <NativeStack.Navigator screenOptions={{headerShown: false}}>
      <NativeStack.Screen name="BottomTabs" component={BottomTabs} />
    </NativeStack.Navigator>
  );
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const isLoggedIn = useSelector<RootState>(state => state.profile.isLoggedIn);
  const dispatch = useDispatch();

  const isAuthenticated = useCallback(async () => {
    try {
      const _isLoggedIn = await magic.user.isLoggedIn();
      dispatch(setIsLoggedIn({isLoggedIn: _isLoggedIn}));
    } catch (error) {}
  }, [dispatch]);

  useEffect(() => {
    isAuthenticated();
  }, [isAuthenticated]);

  return (
    <ConvexProvider client={convex}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.backgroundStyle}>
          <magic.Relayer />
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{headerShown: false, title: ''}}>
              {isLoggedIn ? (
                <Stack.Group>
                  <Stack.Screen
                    name="Root"
                    component={NativeStackScreens}
                    options={{gestureEnabled: false}}
                  />
                </Stack.Group>
              ) : (
                <Stack.Group
                  screenOptions={{
                    headerShown: false,
                    title: '',
                  }}>
                  <Stack.Screen name="Login" component={Login} />
                </Stack.Group>
              )}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </ConvexProvider>
  );
}

const styles = ScaledSheet.create({
  backgroundStyle: {
    height: '100%',
    backgroundColor: colors.background.dark,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
