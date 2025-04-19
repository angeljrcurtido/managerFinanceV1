import * as SQLite from 'expo-sqlite';

// Creamos una función para obtener la instancia de la base de datos de forma única.
let dbPromise: Promise<SQLite.SQLiteDatabase>;

async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) {
    dbPromise = SQLite.openDatabaseAsync('incomes.db');
  }
  return dbPromise;
}

// Inicializa la base de datos: crea las tablas si no existen.
export async function initDB(): Promise<void> {
  const db = await getDatabase();

  // Crear tabla de categorías.
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS categories (
       id INTEGER PRIMARY KEY NOT NULL,
       name TEXT UNIQUE NOT NULL
     );`
  );

  // Crear tabla de ingresos con referencia a la categoría.
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS incomes (
       id INTEGER PRIMARY KEY NOT NULL,
       amount REAL,
       description TEXT,
       date TEXT,
       category_id INTEGER,
       deleted_at TEXT,
       FOREIGN KEY (category_id) REFERENCES categories(id)
     );`
  );
}
// Inserta un ingreso en la base de datos.
export async function insertIncome(
  amount: number,
  description: string,
  date: string,
  category: string 
): Promise<any> {  // Usamos any en lugar de SQLResultSet
  const db = await getDatabase();
  return await db.runAsync(
    'INSERT INTO incomes (amount, description, date, category) VALUES (?, ?, ?)',
    amount,
    description,
    date,
    category
  );
}
  
// Obtiene todos los ingresos que no han sido anulados.
export async function fetchIncomes(): Promise<any[]> {
  const db = await getDatabase();
  // Solo se traen aquellos registros en los que deleted_at es NULL.
  const result = await db.getAllAsync('SELECT * FROM incomes WHERE deleted_at IS NULL');
  return result;
}

// Realiza un soft delete: actualiza la columna deleted_at.
export async function softDeleteIncome(id: number): Promise<any> {
  const db = await getDatabase();
  const date = new Date().toISOString();
  return await db.runAsync('UPDATE incomes SET deleted_at = ? WHERE id = ?', date, id);
}

// Obtiene los ingresos que no han sido anulados y que estén entre startDate y endDate.
export async function fetchIncomesByDate(startDate: string, endDate: string): Promise<any[]> {
  const db = await getDatabase();
  const result = await db.getAllAsync(
    `SELECT * FROM incomes 
       WHERE deleted_at IS NULL 
         AND (SUBSTR(date, 7, 4) || '-' || SUBSTR(date, 4, 2) || '-' || SUBSTR(date, 1, 2)) BETWEEN ? AND ?`,
    startDate,
    endDate
  );
  return result;
}