import { useEffect, useState } from 'react';

interface NetworkInformation extends EventTarget {
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  saveData?: boolean;
  rtt?: number;
  downlink?: number;
}

export function useNetworkQuality() {
  const [effectiveType, setEffectiveType] = useState<string>('4g');
  const [saveData, setSaveData] = useState<boolean>(false);
  const [rtt, setRtt] = useState<number | undefined>(undefined);

  useEffect(() => {
    const nav = navigator as unknown as { connection?: NetworkInformation };
    const connection = nav.connection;

    if (!connection) return;

    const updateConnectionInfo = () => {
      if (connection.effectiveType) {
        setEffectiveType(connection.effectiveType);
      }
      if (typeof connection.saveData === 'boolean') {
        setSaveData(connection.saveData);
      }
      if (typeof connection.rtt === 'number') {
        setRtt(connection.rtt);
      }
    };

    updateConnectionInfo();

    if ('addEventListener' in connection) {
      connection.addEventListener('change', updateConnectionInfo);
      return () => {
        connection.removeEventListener('change', updateConnectionInfo);
      };
    }
  }, []);

  const isSlowConnection = effectiveType === '2g' || effectiveType === 'slow-2g' || effectiveType === '3g';

  return {
    effectiveType,
    saveData,
    rtt,
    isSlowConnection,
  };
}
