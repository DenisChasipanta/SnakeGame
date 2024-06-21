import 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigator } from './src/navigator/StackNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => {
  return (
    <GestureHandlerRootView style={{flex:1}}>
    <NavigationContainer>
      <PaperProvider>
        <StackNavigator/>
      </PaperProvider>
    </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App;
