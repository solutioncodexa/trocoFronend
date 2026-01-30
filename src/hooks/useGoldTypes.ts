import { useQuery } from '@tanstack/react-query';
import { goldTypesApi } from '@/services/api';

// Couleurs pour les pastilles (Boutique, SurMesure)
const GOLD_TYPE_COLORS: Record<string, string> = {
  yellow: '#FFD700',
  white: '#E5E4E2',
  rose: '#B76E79',
};

export interface GoldTypeWithColor {
  id: string;
  label: string;
  color: string;
}

export function useGoldTypes() {
  const { data: goldTypes = [], isLoading } = useQuery({
    queryKey: ['goldTypes'],
    queryFn: () => goldTypesApi.getAllGoldTypes(),
    retry: 1,
  });

  const goldTypeLabels: Record<string, string> = goldTypes.reduce(
    (acc, gt) => {
      acc[gt.code.toLowerCase()] = gt.name;
      return acc;
    },
    {} as Record<string, string>
  );

  const goldTypesWithColors: GoldTypeWithColor[] = goldTypes.map((gt) => ({
    id: gt.code.toLowerCase(),
    label: gt.name,
    color: GOLD_TYPE_COLORS[gt.code.toLowerCase()] ?? '#CCCCCC',
  }));

  const getGoldTypeName = (code: string): string =>
    goldTypeLabels[code?.toLowerCase()] ?? code ?? '';

  return {
    goldTypes,
    goldTypeLabels,
    goldTypesWithColors,
    getGoldTypeName,
    isLoading,
  };
}
