import { memo } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface SettingsTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onLogout: () => void;
}

export const SettingsTabs = memo(({ tabs, activeTab, onTabChange, onLogout }: SettingsTabsProps) => (
  <div className="glass-card p-4 space-y-2">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onTabChange(tab.id)}
        className={cn(
          "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 text-left",
          activeTab === tab.id
            ? 'bg-neon-green/20 text-neon-green border border-neon-green/30'
            : 'text-gray-300 hover:bg-white/10 hover:text-white'
        )}
      >
        <tab.icon size={20} />
        <span className="font-medium">{tab.label}</span>
      </button>
    ))}
    
    <div className="pt-4 border-t border-white/10">
      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-300"
      >
        <span className="font-medium">Cerrar Sesión</span>
      </button>
    </div>
  </div>
));

SettingsTabs.displayName = 'SettingsTabs';
