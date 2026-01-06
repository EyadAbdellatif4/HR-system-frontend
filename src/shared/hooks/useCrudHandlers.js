export function useCrudHandlers(createItem, updateItem, deleteItem, setLoadingItem, setExpandedRowId, setIsCreating) {
  const handleCreateSubmit = async (data) => {
    setLoadingItem(true);
    try {
      const result = await createItem(data);
      setIsCreating(false);
      return result;
    } catch (err) {
      console.error('Error creating item:', err);
      throw err;
    } finally {
      setLoadingItem(false);
    }
  };

  const handleUpdate = async (id, data) => {
    setLoadingItem(true);
    try {
      const result = await updateItem(id, data);
      setExpandedRowId(null);
      return result;
    } catch (err) {
      console.error('Error updating item:', err);
      throw err;
    } finally {
      setLoadingItem(false);
    }
  };

  const handleDelete = async (item) => {
    setLoadingItem(true);
    try {
      await deleteItem(item.id);
      setExpandedRowId(null);
    } catch (err) {
      console.error('Error deleting item:', err);
    } finally {
      setLoadingItem(false);
    }
  };

  return {
    handleCreateSubmit,
    handleUpdate,
    handleDelete,
  };
}

