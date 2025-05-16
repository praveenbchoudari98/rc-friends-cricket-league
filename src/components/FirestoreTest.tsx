import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';

export const FirestoreTest = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Firestore connection...');
        const tournamentsRef = collection(db, 'tournaments');
        const snapshot = await getDocs(tournamentsRef);
        console.log('Successfully fetched documents:', snapshot.size);
        setStatus('success');
      } catch (err) {
        console.error('Firestore error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    testConnection();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Firestore Connection Test</h2>
      {status === 'loading' && <p>Testing connection...</p>}
      {status === 'success' && <p style={{ color: 'green' }}>✅ Connection successful!</p>}
      {status === 'error' && (
        <div style={{ color: 'red' }}>
          <p>❌ Connection failed</p>
          {error && <p>Error: {error}</p>}
        </div>
      )}
    </div>
  );
}; 