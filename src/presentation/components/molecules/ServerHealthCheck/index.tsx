import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, AppState, AppStateStatus } from 'react-native';
import CText from '@/presentation/components/atoms/CText';
import CIconButton from '@/presentation/components/atoms/CIconButton';
import { CONFIG } from '@config';
import { useStyles } from './styles';

export const ServerHealthCheck = ({ children }: { children: React.ReactNode }) => {
  const [status, setStatus] = useState<'checking' | 'healthy' | 'error'>('checking');
  const { styles, colors } = useStyles();
  
  const checkHealth = async (silent = false) => {
    if (!silent) setStatus('checking');
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${CONFIG.HTTP_URL}/check-health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      
      if (res.ok) {
        setStatus('healthy');
      } else {
        setStatus('error');
      }
    } catch (e) {
      setStatus('error');
    }
  };

  useEffect(() => {
    checkHealth();

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        checkHealth(true);
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  if (status === 'checking') {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <CText variant="body" color="textSecondary" style={styles.checkingText}>
          Connecting to server...
        </CText>
      </View>
    );
  }

  if (status === 'error') {
    return (
      <View style={styles.errorContainer}>
        <CIconButton 
          iconName="server-outline" 
          size={64} 
          variant="ghost" 
          disabled 
          iconColor="textSecondary" 
        />
        <CText variant="heading" style={styles.errorHeading}>
          Server Not Running
        </CText>
        <CText variant="body" color="textSecondary" style={styles.errorBody}>
          We couldn't connect to the local chat server. Please make sure it's running!
          {"\n\n"}
          <CText style={styles.codeBlock}>cd server</CText>{"\n"}
          <CText style={styles.codeBlock}>npm run start</CText>
        </CText>
        <CIconButton 
          iconName="refresh" 
          variant="primary" 
          size={24} 
          onPress={checkHealth} 
        />
        <CText variant="caption" color="textSecondary" style={styles.retryText}>
          Retry Connection
        </CText>
      </View>
    );
  }

  return <>{children}</>;
};
