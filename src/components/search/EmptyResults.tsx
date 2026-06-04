import { Search } from 'lucide-react';
import Button from '@/components/common/Button';
import EmptyState from '@/components/common/EmptyState';

interface EmptyResultsProps {
  onModifySearch?: () => void;
}

export default function EmptyResults({ onModifySearch }: EmptyResultsProps) {
  return (
    <EmptyState
      icon={<Search className="w-12 h-12" />}
      title="Aucun départ trouvé"
      description="Aucun départ n'est disponible pour ces critères. Essayez de modifier votre recherche."
      action={
        <Button onClick={onModifySearch}>
          Modifier la recherche
        </Button>
      }
    />
  );
}