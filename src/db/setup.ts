import Database from 'better-sqlite3';
import { join } from 'path';

const db = new Database('hospital.db');

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS procedures (
    id TEXT PRIMARY KEY,
    patient_name TEXT NOT NULL,
    procedure_name TEXT NOT NULL,
    priority TEXT NOT NULL,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS scheduled_procedures (
    id TEXT PRIMARY KEY,
    procedure_id TEXT NOT NULL,
    room TEXT NOT NULL,
    scheduled_time TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (procedure_id) REFERENCES procedures (id) ON DELETE CASCADE
  );
`);

console.log('Database setup completed');