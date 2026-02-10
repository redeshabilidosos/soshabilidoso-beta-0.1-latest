'use client';

import { CyberButton } from '@/components/ui/cyber-button';

interface DonationFiltersProps {
  sports: string[];
  selectedSport: string;
  onSportChange: (sport: string) => void;
}

export function DonationFilters({
  sports,
  selectedSport,
  onSportChange,
}: DonationFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {sports.map((sport) => (
        <CyberButton
          key={sport}
          variant={selectedSport === sport ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onSportChange(sport)}
          className={
            selectedSport === sport
              ? 'bg-neon-green text-black hover:bg-neon-green/90'
              : ''
          }
        >
          {sport}
        </CyberButton>
      ))}
    </div>
  );
}
