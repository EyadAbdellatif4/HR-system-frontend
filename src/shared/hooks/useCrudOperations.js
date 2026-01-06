import { useMutation, useQueryClient } from '@tanstack/react-query';

export function useCrudOperations(entityName, operations, setError, setSuccess) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: operations.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityName] });
      setSuccess(`${entityName} created successfully`);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to create ${entityName}`;
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      setError(formattedError);
      throw error;
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data, files }) => operations.update(id, data, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityName] });
      setSuccess(`${entityName} updated successfully`);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to update ${entityName}`;
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      setError(formattedError);
      throw error;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: operations.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [entityName] });
      setSuccess(`${entityName} deleted successfully`);
    },
    onError: (error) => {
      const errorMessage = error?.response?.data?.message || error?.message || `Failed to delete ${entityName}`;
      const formattedError = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
      setError(formattedError);
      throw error;
    },
  });

  return {
    create: async (data, files) => {
      return await createMutation.mutateAsync(data, files);
    },
    update: async (id, data, files) => {
      return await updateMutation.mutateAsync({ id, data, files });
    },
    delete: async (id) => {
      return await deleteMutation.mutateAsync(id);
    },
    getById: operations.getById,
  };
}

