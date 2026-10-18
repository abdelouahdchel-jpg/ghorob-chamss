import { JsonFileStore } from './jsonStore';
import { PostgresStore } from './postgresStore';
import { IDataStore } from './types';

let cachedStore: IDataStore | null = null;

export async function getDataStore(): Promise<IDataStore> {
  if (cachedStore) {
    return cachedStore;
  }

  const databaseUrl = process.env.DATABASE_URL?.trim();

  if (databaseUrl) {
    console.log('[Storage] Initializing PostgreSQL storage driver from DATABASE_URL...');
    try {
      const pgStore = new PostgresStore(databaseUrl);
      await pgStore.init();
      console.log('[Storage] PostgreSQL connected and initialized successfully.');
      cachedStore = pgStore;
      return cachedStore;
    } catch (err) {
      console.error('[Storage] Failed to connect to PostgreSQL database:', err);
      console.warn('[Storage] Falling back to file-based JSON storage (data/database.json).');
    }
  }

  console.log('[Storage] Using local file-based JSON storage (data/database.json).');
  const jsonStore = new JsonFileStore();
  await jsonStore.init();
  cachedStore = jsonStore;
  return cachedStore;
}
