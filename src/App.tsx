import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Text, ActivityIndicator, AppState, AppStateStatus } from "react-native";
import { ThemeProvider, useTheme } from "./theme/ThemeProvider";
import { ComponentShowcase } from "./presentation/components/ComponentShowcase";
import { ChatScreen } from "./presentation/screens/ChatScreen";
import { ServerHealthCheck } from "./presentation/components/molecules/ServerHealthCheck";

const Stack = createNativeStackNavigator();

const ChatNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="Chat"
      component={ChatScreen}
      options={{ title: "AI Assistant", headerShown: false }}
    />
    <Stack.Screen
      name="ComponentShowcase"
      component={ComponentShowcase}
      options={{ title: "Design System" }}
    />
    <Stack.Screen
      name="Conversations"
      component={() => (
        <View>
          <Text>Hi</Text>
        </View>
      )}
    />
    <Stack.Screen
      name="ChatDetails"
      component={() => (
        <View>
          <Text>Chat Details</Text>
        </View>
      )}
    />
  </Stack.Navigator>
);

const RootStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ChatFlow" component={ChatNavigator} />
  </Stack.Navigator>
);



const App = () => (
  <ThemeProvider>
    <SafeAreaProvider>
      <ServerHealthCheck>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </ServerHealthCheck>
    </SafeAreaProvider>
  </ThemeProvider>
);

export default App;
