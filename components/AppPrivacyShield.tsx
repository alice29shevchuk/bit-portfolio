import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';

import PrivacyShield from '@/components/PrivacyShield';

export default function AppPrivacyShield() {
  const appState = useRef(AppState.currentState);
  const [visible, setVisible] = useState(
    () => appState.current !== 'active',
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next) => {
      appState.current = next;
      setVisible(next !== 'active');
    });
    return () => sub.remove();
  }, []);

  return <PrivacyShield visible={visible} />;
}
