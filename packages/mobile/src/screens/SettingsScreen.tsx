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
import { colors } from '../theme/colors';
import { AnimatedButton, FadeInView } from '../components';

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

      <FadeInView delay={100} style={styles.section}>
        <Text style={styles.sectionTitle}>Location Update Frequency</Text>
        <Text style={styles.sectionSubtitle}>
          Choose how often your location is shared with family
        </Text>

        {FREQUENCY_OPTIONS.map((option) => (
          <AnimatedButton
            key={option.id}
            style={[
              styles.optionCard,
              selectedFrequency === option.id && styles.optionCardSelected,
            ]}
            onPress={() => handleFrequencyChange(option.id)}
            activeScale={0.98}
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
          </AnimatedButton>
        ))}
      </FadeInView>

      <View style={styles.footer}>
        <AnimatedButton style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </AnimatedButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
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
    color: colors.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  optionCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceLight,
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
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
  optionContent: {
    flex: 1,
  },
  optionName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
    marginBottom: 4,
  },
  optionDetail: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    backgroundColor: colors.error,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
