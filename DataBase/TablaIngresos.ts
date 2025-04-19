import { getDatabase } from './databaseConfig';

// Inicializa la tabla de ingresos (si no existe) con la columna category_id para relacionarla con Categorías.
export async function initIngresosTable(): Promise<void> {
  const db = await getDatabase();
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

export async function insertIncome(
  amount: number,
  description: string,
  date: string,
  category_id: number
): Promise<any> {
  const db = await getDatabase();
  return await db.runAsync(
    'INSERT INTO incomes (amount, description, date, category_id) VALUES (?, ?, ?, ?)',
    amount,
    description,
    date,
    category_id
  );
}

export async function fetchIncomes(): Promise<any[]> {
  const db = await getDatabase();
  return await db.getAllAsync('SELECT * FROM incomes WHERE deleted_at IS NULL');
}

export async function softDeleteIncome(id: number): Promise<any> {
  const db = await getDatabase();
  const now = new Date().toISOString();
  return await db.runAsync('UPDATE incomes SET deleted_at = ? WHERE id = ?', now, id);
}

export async function fetchIncomesByDate(startDate: string, endDate: string): Promise<any[]> {
  const db = await getDatabase();
  return await db.getAllAsync(
    `SELECT * FROM incomes 
       WHERE deleted_at IS NULL 
         AND (SUBSTR(date, 7, 4) || '-' || SUBSTR(date, 4, 2) || '-' || SUBSTR(date, 1, 2)) BETWEEN ? AND ?`,
    startDate,
    endDate
  );
}
