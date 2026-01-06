import React from 'react';
import {
  Dialog,
  DialogBody,
  DialogFooter,
  Typography,
  Button,
} from '@material-tailwind/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

/**
 * Reusable Delete Confirmation Dialog component
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether dialog is open
 * @param {Function} props.onClose - Callback to close dialog
 * @param {Object} props.itemToDelete - The item being deleted
 * @param {string} props.itemName - Display name of the item type (e.g., "project", "voucher", "user")
 * @param {string} props.itemNameField - Field name to extract from itemToDelete for display (e.g., "name", "voucher_name")
 * @param {Function} props.onConfirm - Callback when delete is confirmed
 * @param {boolean} props.loading - Whether delete operation is in progress
 * @param {string} props.confirmButtonText - Optional custom confirm button text
 */
export function DeleteConfirmationDialog({
  isOpen,
  onClose,
  itemToDelete,
  itemName,
  itemNameField = 'name',
  onConfirm,
  loading,
  confirmButtonText,
}) {
  const displayName = itemToDelete?.[itemNameField] || 'this item';
  const buttonText = confirmButtonText || 'Delete';
  const itemTypeCapitalized = itemName.charAt(0).toUpperCase() + itemName.slice(1);

  return (
    <Dialog open={isOpen} handler={onClose} size="sm" className="rounded-lg">
      <DialogBody className="p-6">
        <div className="flex items-start gap-4">
          {/* Warning Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
              <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <Typography variant="h6" className="text-text-primary font-bold mb-3">
              Delete {itemName}
            </Typography>
            <Typography variant="paragraph" className="text-text-primary mb-1">
              Are you sure you want to remove this {itemName}? This action cannot be undone!
            </Typography>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 pb-6 px-6">
        <Button
          variant="outlined"
          className="text-text-primary bg-white border border-gray-300 hover:bg-gray-50"
          onClick={onClose}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? 'Deleting...' : buttonText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}

