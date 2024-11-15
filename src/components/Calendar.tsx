import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { startOfWeek, addDays, format, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns';

type ScheduledProcedure = {
  id: string;
  patientName: string;
  procedureName: string;
  priority: string;
  time: string;
  room: string;
};

type CalendarProps = {
  scheduledProcedures: ScheduledProcedure[];
  selectedRoom: string;
  onRoomChange: (room: any) => void;
  rooms: Record<string, string>;
  onProcedureClick: (procedure: ScheduledProcedure) => void;
};

export default function Calendar({ 
  scheduledProcedures, 
  selectedRoom, 
  onRoomChange, 
  rooms,
  onProcedureClick 
}: CalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const hours = Array.from({ length: 9 }, (_, i) => i + 9); // 9 AM to 5 PM

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 });
  const days = Array.from({ length: 5 }, (_, i) => addDays(weekStart, i));

  const getScheduledProcedure = (day: Date, hour: number) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return scheduledProcedures.find(
      proc => proc.time === `${dayStr}-${hour}`
    );
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(current => 
      direction === 'next' ? addWeeks(current, 1) : subWeeks(current, 1)
    );
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Schedule</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <select
            value={selectedRoom}
            onChange={(e) => onRoomChange(e.target.value)}
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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 border-b-2 border-gray-200"></th>
              {days.map(day => (
                <th key={day.toISOString()} className="p-2 border-b-2 border-gray-200 text-left min-w-[200px]">
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
                <td className="p-2 border-b border-gray-200 text-gray-600 whitespace-nowrap">
                  {hour.toString().padStart(2, '0')}:00
                </td>
                {days.map(day => {
                  const procedure = getScheduledProcedure(day, hour);
                  return (
                    <td key={`${day.toISOString()}-${hour}`} className="p-2 border-b border-gray-200">
                      {procedure ? (
                        <button
                          onClick={() => onProcedureClick(procedure)}
                          className="w-full bg-blue-50 p-2 rounded-md hover:bg-blue-100 transition-colors text-left"
                        >
                          <p className="font-medium text-blue-900">{procedure.patientName}</p>
                          <p className="text-sm text-blue-700">{procedure.procedureName}</p>
                        </button>
                      ) : (
                        <div className="h-14 bg-gray-50 rounded-md border-2 border-dashed border-gray-200"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}