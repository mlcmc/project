import { useState, useEffect } from 'react';
import dbOperations, { Procedure, ScheduledProcedure } from '../db';

export function useDatabase() {
  const [pendingProcedures, setPendingProcedures] = useState<Procedure[]>([]);
  const [scheduledProcedures, setScheduledProcedures] = useState<ScheduledProcedure[]>([]);

  // Load initial data
  useEffect(() => {
    loadProcedures();
  }, []);

  const loadProcedures = () => {
    try {
      const pending = dbOperations.getPendingProcedures.all();
      const scheduled = dbOperations.getScheduledProcedures.all();
      
      setPendingProcedures(pending);
      setScheduledProcedures(scheduled);
    } catch (error) {
      console.error('Error loading procedures:', error);
    }
  };

  const createProcedure = (procedure: Procedure) => {
    try {
      dbOperations.createProcedure.run(procedure);
      loadProcedures();
    } catch (error) {
      console.error('Error creating procedure:', error);
      throw error;
    }
  };

  const scheduleProcedure = (procedure: Procedure, time: string, room: string) => {
    try {
      dbOperations.beginTransaction();
      
      dbOperations.scheduleProcedure.run({
        id: crypto.randomUUID(),
        procedureId: procedure.id,
        room,
        scheduledTime: time
      });
      
      dbOperations.commit();
      loadProcedures();
    } catch (error) {
      dbOperations.rollback();
      console.error('Error scheduling procedure:', error);
      throw error;
    }
  };

  const updateScheduledProcedure = (
    procedure: ScheduledProcedure,
    newTime: string,
    newRoom: string
  ) => {
    try {
      dbOperations.updateScheduledProcedure.run({
        procedureId: procedure.id,
        room: newRoom,
        scheduledTime: newTime
      });
      loadProcedures();
    } catch (error) {
      console.error('Error updating scheduled procedure:', error);
      throw error;
    }
  };

  const deleteScheduledProcedure = (procedureId: string) => {
    try {
      dbOperations.deleteScheduledProcedure.run({ procedureId });
      loadProcedures();
    } catch (error) {
      console.error('Error deleting scheduled procedure:', error);
      throw error;
    }
  };

  return {
    pendingProcedures,
    scheduledProcedures,
    createProcedure,
    scheduleProcedure,
    updateScheduledProcedure,
    deleteScheduledProcedure
  };
}