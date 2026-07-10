import { useState, useEffect } from 'react';
import { openDatabase } from '~/lib/persistence/db';

/**
 * Hook to initialize and provide access to the primary IndexedDB database.
 */
export function useIndexedDB() {
  const [db, setDb] = useState<IDBDatabase | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    let database: IDBDatabase | undefined;

    const initDB = async () => {
      try {
        setIsLoading(true);
        database = await openDatabase();

        if (!active) {
          database?.close();
          return;
        }

        if (database) {
          setDb(database);
        } else {
          setError(new Error('Failed to open IndexedDB'));
        }
      } catch (err) {
        if (active) {
          setError(err instanceof Error ? err : new Error('Unknown error initializing database'));
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    initDB();

    return () => {
      active = false;
      database?.close();
    };
  }, []);

  return { db, isLoading, error };
}
