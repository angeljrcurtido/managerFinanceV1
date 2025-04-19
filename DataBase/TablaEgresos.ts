import { getDatabase } from './databaseConfig';

// Inicializa la tabla de egresos (si no existe) con la columna category_id para relacionarla con Categorías.
export async function initEgresosTable(): Promise<void> {
  const db = await getDatabase();
  await db.execAsync(
    `CREATE TABLE IF NOT EXISTS expenses (
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

export async function insertExpense(
  amount: number,
  description: string,
  date: string,
  category_id: number
): Promise<any> {
  const db = await getDatabase();
  return await db.runAsync(
    'INSERT INTO expenses (amount, description, date, category_id) VALUES (?, ?, ?, ?)',
    amount,
    description,
    date,
    category_id
  );
}

export async function fetchExpenses(): Promise<any[]> {
  const db = await getDatabase();
  return await db.getAllAsync('SELECT * FROM expenses WHERE deleted_at IS NULL');
}

export async function softDeleteExpense(id: number): Promise<any> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  return await db.runAsync('UPDATE expenses SET deleted_at = ? WHERE id = ?', now, id);
}

export async function fetchExpensesByDate(startDate: string, endDate: string): Promise<any[]> {
  const db = await getDatabase();
  return await db.getAllAsync(
    `SELECT * FROM expenses 
       WHERE deleted_at IS NULL 
         AND (SUBSTR(date, 7, 4) || '-' || SUBSTR(date, 4, 2) || '-' || SUBSTR(date, 1, 2)) BETWEEN ? AND ?`,
    startDate,
    endDate
  );
}
