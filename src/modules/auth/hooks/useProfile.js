import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userService } from '@/modules/admin/services';
import { useAuth } from '@/providers/authContext';

export function useProfile() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data, isLoading, error: queryError, refetch } = useQuery({
    queryKey: ['currentUser', authUser?.id],
    queryFn: async () => {
      try {
        const response = await userService.getCurrentUser();
        return response.user || response;
      } catch (err) {
        throw err;
      }
    },
    enabled: !!authUser?.id,
    staleTime: 30000,
    onError: (err) => {
      setError(err?.response?.data?.message || err?.message || 'Failed to fetch profile');
    },
  });

  useEffect(() => {
    if (data) {
      setUser(data);
      setLoading(false);
    } else if (queryError) {
      setError(queryError);
      setLoading(false);
    } else if (!isLoading) {
      setLoading(false);
    }
  }, [data, queryError, isLoading]);

  return {
    user,
    loading: isLoading || loading,
    error: error || queryError?.message,
    refetch,
  };
}

