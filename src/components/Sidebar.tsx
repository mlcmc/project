import React from 'react';
import { ClipboardList, Calendar, Clock } from 'lucide-react';

type Tab = 'order' | 'pending' | 'calendar';

interface SidebarProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export default function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const tabs = [
    { id: 'order' as Tab, label: 'Order Procedure', icon: ClipboardList },
    { id: 'pending' as Tab, label: 'Pending', icon: Clock },
    { id: 'calendar' as Tab, label: 'Calendar', icon: Calendar },
  ];

  return (
    <div className="bg-white w-64 min-h-screen shadow-sm flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-gray-900">Hospital Manager</h1>
      </div>
      <nav className="flex-1 pt-4">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
              ${activeTab === id 
                ? 'bg-blue-50 text-blue-700 border-r-4 border-blue-700' 
                : 'text-gray-600 hover:bg-gray-50'
              }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}