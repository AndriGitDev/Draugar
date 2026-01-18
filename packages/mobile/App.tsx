// Must import before any component renders to register background task
import './src/services/location';

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';

// Verify shared types are accessible from workspace package
import type { User, Location } from '@draugar/shared';

// Type assertion to confirm imports work at compile time
const _typeCheck: { user: User; location: Location } | null = null;

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AuthProvider>
  );
}
