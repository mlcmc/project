import React, { useState } from 'react';
import { ClipboardList } from 'lucide-react';

type Procedure = {
  id: string;
  patientName: string;
  procedureName: string;
  priority: 'urgent' | 'normal' | 'low';
  notes: string;
};

export default function ProcedureForm({ onSubmit }: { onSubmit: (procedure: Procedure) => void }) {
  const [formData, setFormData] = useState({
    patientName: '',
    procedureName: '',
    priority: 'normal',
    notes: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: crypto.randomUUID(),
      ...formData,
    } as Procedure);
    setFormData({
      patientName: '',
      procedureName: '',
      priority: 'normal',
      notes: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Order New Procedure</h2>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient Name
          </label>
          <input
            type="text"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.patientName}
            onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Procedure
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.procedureName}
            onChange={(e) => setFormData(prev => ({ ...prev, procedureName: e.target.value }))}
          >
            <option value="">Select procedure...</option>
            <option value="MRI">MRI Scan</option>
            <option value="CT">CT Scan</option>
            <option value="X-Ray">X-Ray</option>
            <option value="Ultrasound">Ultrasound</option>
            <option value="Blood Work">Blood Work</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as 'urgent' | 'normal' | 'low' }))}
          >
            <option value="urgent">Urgent</option>
            <option value="normal">Normal</option>
            <option value="low">Low Priority</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Order Procedure
        </button>
      </form>
    </div>
  );
}