import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ProcedureForm from './components/ProcedureForm';
import ProcedureList from './components/ProcedureList';
import Calendar from './components/Calendar';
import SchedulingModal from './components/SchedulingModal';
import EditProcedureModal from './components/EditProcedureModal';
import { format, parseISO } from 'date-fns';

type Tab = 'order' | 'pending' | 'calendar';
type Room = 'angiografo-ge' | 'angiografo-siemens' | 'tomografia' | 'ultrassom';

export const ROOMS: Record<Room, string> = {
  'angiografo-ge': 'Angiógrafo GE',
  'angiografo-siemens': 'Angiógrafo Siemens',
  'tomografia': 'Tomografia',
  'ultrassom': 'Ultrassom'
};

type Procedure = {
  id: string;
  patientName: string;
  procedureName: string;
  priority: 'urgent' | 'normal' | 'low';
  notes: string;
};

type ScheduledProcedure = Procedure & {
  time: string;
  room: Room;
};

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('order');
  const [selectedRoom, setSelectedRoom] = useState<Room>('angiografo-ge');
  const [pendingProcedures, setPendingProcedures] = useState<Procedure[]>([]);
  const [scheduledProcedures, setScheduledProcedures] = useState<ScheduledProcedure[]>([]);
  const [selectedProcedure, setSelectedProcedure] = useState<Procedure | null>(null);
  const [selectedScheduledProcedure, setSelectedScheduledProcedure] = useState<ScheduledProcedure | null>(null);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleProcedureSubmit = (procedure: Procedure) => {
    setPendingProcedures(prev => [...prev, procedure]);
    setActiveTab('pending');
  };

  const handleSchedule = (procedure: Procedure) => {
    setSelectedProcedure(procedure);
    setIsSchedulingModalOpen(true);
  };

  const handleEditProcedure = (procedure: ScheduledProcedure) => {
    setSelectedScheduledProcedure(procedure);
    setIsEditModalOpen(true);
  };

  const scheduleForSlot = (day: string, hour: number, room: Room) => {
    if (selectedProcedure) {
      const scheduledProcedure = {
        ...selectedProcedure,
        time: `${day}-${hour}`,
        room
      };
      
      setScheduledProcedures(prev => [...prev, scheduledProcedure as ScheduledProcedure]);
      setPendingProcedures(prev => prev.filter(p => p.id !== selectedProcedure.id));
      setSelectedProcedure(null);
      setActiveTab('calendar');
    }
  };

  const updateScheduledProcedure = (
    procedure: ScheduledProcedure,
    newDay: string,
    newHour: number,
    newRoom: Room
  ) => {
    setScheduledProcedures(prev => prev.map(p => 
      p.id === procedure.id
        ? { ...p, time: `${newDay}-${newHour}`, room: newRoom }
        : p
    ));
  };

  const deleteScheduledProcedure = (procedureId: string) => {
    const procedure = scheduledProcedures.find(p => p.id === procedureId);
    if (procedure) {
      setScheduledProcedures(prev => prev.filter(p => p.id !== procedureId));
      setPendingProcedures(prev => [...prev, {
        id: procedure.id,
        patientName: procedure.patientName,
        procedureName: procedure.procedureName,
        priority: procedure.priority,
        notes: procedure.notes
      }]);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'order':
        return <ProcedureForm onSubmit={handleProcedureSubmit} />;
      case 'pending':
        return (
          <ProcedureList 
            procedures={pendingProcedures}
            onSchedule={handleSchedule}
          />
        );
      case 'calendar':
        return (
          <Calendar 
            scheduledProcedures={scheduledProcedures.filter(p => p.room === selectedRoom)}
            selectedRoom={selectedRoom}
            onRoomChange={setSelectedRoom}
            rooms={ROOMS}
            onProcedureClick={handleEditProcedure}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          {renderContent()}
        </div>
      </main>

      <SchedulingModal
        isOpen={isSchedulingModalOpen}
        onClose={() => setIsSchedulingModalOpen(false)}
        procedure={selectedProcedure}
        onSchedule={scheduleForSlot}
        scheduledProcedures={scheduledProcedures}
        rooms={ROOMS}
      />

      <EditProcedureModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        procedure={selectedScheduledProcedure}
        onUpdate={updateScheduledProcedure}
        onDelete={deleteScheduledProcedure}
        scheduledProcedures={scheduledProcedures}
        rooms={ROOMS}
      />
    </div>
  );
}

export default App;