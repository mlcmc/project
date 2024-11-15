import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfWeek, addDays, format, addWeeks, subWeeks, isSameDay } from 'date-fns';

type Procedure = {
  id: string;
  patientName: string;
  procedureName: string;
  priority: string;
};

type ScheduledProcedure = Procedure & {
  time: string;
  room: string;
};

interface SchedulingModalProps {
  isOpen: boolean;
  onClose: () => void;
  procedure: Procedure | null;
  onSchedule: (day: string, hour: number, room: string) => void;
  scheduledProcedures: ScheduledProcedure[];
  rooms: Record<string, string>;
}

export default function SchedulingModal({
  isOpen,
  onClose,
  procedure,
  onSchedule,
  scheduledProcedures,
  rooms,
}: SchedulingModalProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState(Object.keys(rooms)[0]);
  
  if (!isOpen || !procedure) return null;

  const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM
  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const isSlotTaken = (day: Date, hour: number) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return scheduledProcedures.some(
      proc => proc.time === `${dayStr}-${hour}` && proc.room === selectedRoom
    );
  };

  const handleSlotClick = (day: Date, hour: number) => {
    if (!isSlotTaken(day, hour)) {
      onSchedule(format(day, 'yyyy-MM-dd'), hour, selectedRoom);
      onClose();
    }
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(current => 
      direction === 'next' ? addWeeks(current, 1) : subWeeks(current, 1)
    );
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Schedule Procedure for {procedure.patientName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <p className="text-gray-600">
              <span className="font-medium">Procedure:</span> {procedure.procedureName}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Priority:</span>{' '}
              <span className={`inline-block px-2 py-1 rounded-full text-sm ${
                procedure.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                procedure.priority === 'normal' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {procedure.priority}
              </span>
            </p>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <select
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(rooms).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              
              <button
                onClick={() => setCurrentWeek(new Date())}
                className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              >
                Today
              </button>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigateWeek('prev')}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <span className="text-sm font-medium text-gray-600">
                {format(weekStart, 'MMMM d')} - {format(addDays(weekStart, 4), 'MMMM d, yyyy')}
              </span>
              <button
                onClick={() => navigateWeek('next')}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="overflow-auto max-h-[60vh]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-2 border-b-2 border-gray-200"></th>
                  {days.map(day => (
                    <th key={day.toISOString()} className="p-2 border-b-2 border-gray-200 text-left">
                      <div className={`flex flex-col ${isToday(day) ? 'text-blue-600' : 'text-gray-900'}`}>
                        <span className="font-medium">{format(day, 'EEEE')}</span>
                        <span className={`text-sm ${isToday(day) ? 'text-blue-600' : 'text-gray-500'}`}>
                          {format(day, 'MMMM d')}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {hours.map(hour => (
                  <tr key={hour}>
                    <td className="p-2 border-b border-gray-200 text-gray-600">
                      {hour.toString().padStart(2, '0')}:00
                    </td>
                    {days.map(day => {
                      const taken = isSlotTaken(day, hour);
                      return (
                        <td key={`${day.toISOString()}-${hour}`} className="p-2 border-b border-gray-200">
                          <button
                            onClick={() => handleSlotClick(day, hour)}
                            disabled={taken}
                            className={`w-full h-12 rounded-md transition-colors ${
                              taken
                                ? 'bg-gray-100 cursor-not-allowed'
                                : 'bg-blue-50 hover:bg-blue-100 cursor-pointer'
                            }`}
                          >
                            {taken ? 'Unavailable' : 'Available'}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}