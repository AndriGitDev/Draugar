import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../context/AuthContext';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

const FREQUENCY_KEY = 'draugar_update_frequency';

type FrequencyPreset = 'low' | 'balanced' | 'high';

interface FrequencyOption {
  id: FrequencyPreset;
  name: string;
  description: string;
  detail: string;
}

const FREQUENCY_OPTIONS: FrequencyOption[] = [
  {
    id: 'low',
    name: 'Battery Saver',
    description: '100m distance, 5 min interval',
    detail: 'Best battery life, updates less frequently',
  },
  {
    id: 'balanced',
    name: 'Balanced',
    description: '50m distance, 1 min interval',
    detail: 'Good balance of accuracy and battery',
  },
  {
    id: 'high',
    name: 'High Accuracy',
    description: '20m distance, 30 sec interval',
    detail: 'Most accurate tracking, uses more battery',
  },
];

interface Props {
  navigation: NativeStackNavigationProp<Record<string, undefined>>;
}

export function SettingsScreen({ navigation }: Props) {
  const { logout } = useAuth();
  const [selectedFrequency, setSelectedFrequency] =
    useState<FrequencyPreset>('balanced');

  useEffect(() => {
    loadFrequencySetting();
  }, []);

  const loadFrequencySetting = async () => {
    try {
      const stored = await SecureStore.getItemAsync(FREQUENCY_KEY);
      if (stored && ['low', 'balanced', 'high'].includes(stored)) {
        setSelectedFrequency(stored as FrequencyPreset);
      }
    } catch (error) {
      console.error('[settings] Failed to load frequency setting:', error);
    }
  };

  const handleFrequencyChange = async (preset: FrequencyPreset) => {
    setSelectedFrequency(preset);
    try {
      await SecureStore.setItemAsync(FREQUENCY_KEY, preset);
      console.log('[settings] Saved frequency:', preset);
    } catch (error) {
      console.error('[settings] Failed to save frequency setting:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location Update Frequency</Text>
        <Text style={styles.sectionSubtitle}>
          Choose how often your location is shared with family
        </Text>

        {FREQUENCY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionCard,
              selectedFrequency === option.id && styles.optionCardSelected,
            ]}
            onPress={() => handleFrequencyChange(option.id)}
          >
            <View style={styles.optionRadio}>
              <View
                style={[
                  styles.radioOuter,
                  selectedFrequency === option.id && styles.radioOuterSelected,
                ]}
              >
                {selectedFrequency === option.id && (
                  <View style={styles.radioInner} />
                )}
              </View>
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionName}>{option.name}</Text>
              <Text style={styles.optionDescription}>{option.description}</Text>
              <Text style={styles.optionDetail}>{option.detail}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#4A90A4',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  placeholder: {
    width: 50,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: '#4A90A4',
    backgroundColor: '#f0f7f9',
  },
  optionRadio: {
    marginRight: 12,
    paddingTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#4A90A4',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4A90A4',
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#4A90A4',
    fontWeight: '500',
    marginBottom: 4,
  },
  optionDetail: {
    fontSize: 13,
    color: '#666',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    backgroundColor: '#dc2626',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
