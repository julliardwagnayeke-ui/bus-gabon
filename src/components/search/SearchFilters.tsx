import { Filter, ArrowUpDown } from 'lucide-react';
import Button from '@/components/common/Button';

interface SearchFiltersProps {
  onFilterChange?: (filters: any) => void;
  onSortChange?: (sort: string) => void;
}

export default function SearchFilters({ onFilterChange, onSortChange }: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <Button variant="outline" size="sm">
        <Filter className="w-4 h-4 mr-2" />
        Filtrer
      </Button>

      <select
        onChange={(e) => onSortChange?.(e.target.value)}
        className="px-4 py-2 rounded-lg border border-border bg-white text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="price-asc">Prix croissant</option>
        <option value="price-desc">Prix décroissant</option>
        <option value="time-asc">Départ le plus tôt</option>
        <option value="time-desc">Départ le plus tard</option>
      </select>
    </div>
  );
}