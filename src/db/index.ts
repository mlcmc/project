import Database from 'better-sqlite3';

const db = new Database('hospital.db');
db.pragma('foreign_keys = ON');

export interface Procedure {
  id: string;
  patientName: string;
  procedureName: string;
  priority: string;
  notes?: string;
}

export interface ScheduledProcedure extends Procedure {
  time: string;
  room: string;
}

export const dbOperations = {
  // Procedures
  createProcedure: db.prepare(`
    INSERT INTO procedures (id, patient_name, procedure_name, priority, notes)
    VALUES (@id, @patientName, @procedureName, @priority, @notes)
  `),

  getPendingProcedures: db.prepare(`
    SELECT p.* 
    FROM procedures p
    LEFT JOIN scheduled_procedures sp ON p.id = sp.procedure_id
    WHERE sp.id IS NULL
  `),

  // Scheduled Procedures
  scheduleProcedure: db.prepare(`
    INSERT INTO scheduled_procedures (id, procedure_id, room, scheduled_time)
    VALUES (@id, @procedureId, @room, @scheduledTime)
  `),

  getScheduledProcedures: db.prepare(`
    SELECT 
      p.id,
      p.patient_name as patientName,
      p.procedure_name as procedureName,
      p.priority,
      p.notes,
      sp.scheduled_time as time,
      sp.room
    FROM scheduled_procedures sp
    JOIN procedures p ON sp.procedure_id = p.id
  `),

  updateScheduledProcedure: db.prepare(`
    UPDATE scheduled_procedures
    SET room = @room, scheduled_time = @scheduledTime
    WHERE procedure_id = @procedureId
  `),

  deleteScheduledProcedure: db.prepare(`
    DELETE FROM scheduled_procedures
    WHERE procedure_id = @procedureId
  `),

  // Transactions
  beginTransaction: () => db.prepare('BEGIN TRANSACTION').run(),
  commit: () => db.prepare('COMMIT').run(),
  rollback: () => db.prepare('ROLLBACK').run()
};

export default dbOperations;