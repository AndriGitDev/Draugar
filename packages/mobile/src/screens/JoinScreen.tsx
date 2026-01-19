import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme/colors';
import { AnimatedButton, AnimatedInput, FadeInView } from '../components';

export function JoinScreen() {
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { join, error } = useAuth();

  const handleCodeChange = (text: string) => {
    // Uppercase and limit to 8 characters
    setCode(text.toUpperCase().slice(0, 8));
  };

  const handleJoin = async () => {
    if (!code.trim() || !name.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await join(code.trim(), name.trim());
    } catch {
      // Error is handled by AuthContext
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = !code.trim() || !name.trim() || isSubmitting;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FadeInView style={styles.content}>
        <Text style={styles.title}>Draugar</Text>
        <Text style={styles.subtitle}>Join your family</Text>

        <View style={styles.form}>
          <AnimatedInput
            style={styles.input}
            placeholder="Invite code"
            placeholderTextColor={colors.textMuted}
            value={code}
            onChangeText={handleCodeChange}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
            editable={!isSubmitting}
          />

          <AnimatedInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!isSubmitting}
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <AnimatedButton
            style={[styles.button, isDisabled && styles.buttonDisabled]}
            onPress={handleJoin}
            disabled={isDisabled}
          >
            {isSubmitting ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={styles.buttonText}>Join</Text>
            )}
          </AnimatedButton>
        </View>
      </FadeInView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.textSecondary,
    marginBottom: 48,
  },
  form: {
    width: '100%',
    maxWidth: 320,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  error: {
    color: colors.error,
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryDark,
    opacity: 0.6,
  },
  buttonText: {
    color: colors.background,
    fontSize: 18,
    fontWeight: '600',
  },
});
