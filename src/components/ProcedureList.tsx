import React from 'react';
import { Calendar, Clock } from 'lucide-react';

type Procedure = {
  id: string;
  patientName: string;
  procedureName: string;
  priority: 'urgent' | 'normal' | 'low';
  notes: string;
};

export default function ProcedureList({ 
  procedures,
  onSchedule
}: { 
  procedures: Procedure[];
  onSchedule: (procedure: Procedure) => void;
}) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'normal': return 'bg-blue-100 text-blue-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-800">Pending Procedures</h2>
      </div>

      <div className="space-y-4">
        {procedures.map((procedure) => (
          <div key={procedure.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900">{procedure.patientName}</h3>
                <p className="text-gray-600">{procedure.procedureName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(procedure.priority)}`}>
                {procedure.priority}
              </span>
            </div>
            
            {procedure.notes && (
              <p className="text-sm text-gray-600 mt-2">{procedure.notes}</p>
            )}
            
            <button
              onClick={() => onSchedule(procedure)}
              className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Calendar className="h-4 w-4" />
              Schedule Procedure
            </button>
          </div>
        ))}
        
        {procedures.length === 0 && (
          <p className="text-center text-gray-500 py-4">No pending procedures</p>
        )}
      </div>
    </div>
  );
}