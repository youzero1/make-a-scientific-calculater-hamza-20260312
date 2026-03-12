import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { CalculationHistory } from '../entities/CalculationHistory';
import * as fs from 'fs';
import * as path from 'path';

const DB_PATH = process.env.DATABASE_PATH || './data/calculator.db';

// Ensure data directory exists
const dataDir = path.dirname(path.resolve(DB_PATH));
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  const dbPath = path.resolve(DB_PATH);
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  dataSource = new DataSource({
    type: 'better-sqlite3',
    database: dbPath,
    synchronize: true,
    logging: false,
    entities: [CalculationHistory],
  });

  await dataSource.initialize();
  return dataSource;
}
