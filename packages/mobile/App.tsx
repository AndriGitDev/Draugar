import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

// Verify shared types are accessible from workspace package
import type { User, Location } from '@draugar/shared';

// Type assertion to confirm imports work at compile time
const _typeCheck: { user: User; location: Location } | null = null;

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Draugar</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
