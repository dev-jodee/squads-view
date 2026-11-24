import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';

const STORAGE_KEY = 'x-address-labels';

type Labels = Record<string, string>;

const getLabels = (): Labels => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
};

export const useAddressLabels = () => {
  const queryClient = useQueryClient();

  const { data: labels } = useSuspenseQuery({
    queryKey: ['addressLabels'],
    queryFn: () => Promise.resolve(getLabels()),
  });

  const setLabel = useMutation({
    mutationFn: ({ address, label }: { address: string; label: string }) => {
      const next = { ...getLabels() };
      if (label.trim()) {
        next[address] = label.trim();
      } else {
        delete next[address];
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return Promise.resolve(next);
    },
    onSuccess: (next) => {
      queryClient.setQueryData(['addressLabels'], next);
    },
  });

  return { labels, setLabel };
};
