import { useEffect, useRef, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import PrivacyShield from '@/components/PrivacyShield';

export default function AppPrivacyShield() {
  const appState = useRef(AppState.currentState);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (next: AppStateStatus) => {
      const prev = appState.current;
      appState.current = next;

      if (prev === 'active' && next !== 'active') {
        setVisible(true);
      } else if (next === 'active') {
        setVisible(false);
      }
    });
    return () => sub.remove();
  }, []);

  return <PrivacyShield visible={visible} />;
}
