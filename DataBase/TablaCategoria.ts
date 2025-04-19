import { getDatabase } from './databaseConfig';

// Inicializa la tabla de categorías si no existe.
export async function initCategoriasTable(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS categories (
       id INTEGER PRIMARY KEY NOT NULL,
       name TEXT UNIQUE NOT NULL,
       icon TEXT
     );`
  );
}

export async function insertCategory(name: string, icon: string): Promise<any> {
  const db = await getDatabase();
  return await db.runAsync(
    'INSERT INTO categories (name, icon) VALUES (?, ?)',
    name,
    icon
  );
}

export async function fetchCategories(): Promise<any[]> {
  const db = await getDatabase();
  return await db.getAllAsync('SELECT * FROM categories');
}
