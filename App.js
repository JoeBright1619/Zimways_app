import { NavigationContainer } from '@react-navigation/native';
import 'react-native-reanimated';
import { ActivityIndicator, View } from 'react-native';
import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';
import { AuthProvider, AuthContext } from './src/context/AuthContext';
import { useContext } from 'react';
import MainTabs from './src/navigation/MainTabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


function RootNavigator() {
  const { user, userData,loading } = useContext(AuthContext);
  console.log("RootNavigator: Current user:", user?user.email:null); // Debug log
  
  if (loading) {
    console.log("RootNavigator: Loading state is true"); // Debug log
    return(
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
    </View>
    ); // Show a loader while loading data
 // Show a loader while loading data
  }
  return user ? <MainStack /> : <AuthStack />;
}

function AppWrapper() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}


export default AppWrapper;
