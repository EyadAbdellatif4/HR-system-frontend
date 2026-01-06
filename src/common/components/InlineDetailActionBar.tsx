import { Typography, Button } from '@material-tailwind/react';

// Optimization: Define static data outside the component to prevent 
// recreation on every render.
const WRAPPED_LABELS = ['Project Status', 'User Status', 'Voucher Status'];

export function InlineDetailActionBar({
  statusLabel,
  isActive,
  onStatusToggle,
  onUpdate,
  onDelete,
  loading = false,
  updateDisabled = false,
  updateButtonText = 'Update', // Set default here
  assigningText,
}) {
  // Optimization: Simple logic calculation instead of a function definition
  // Logic order preserved: 1. assigningText, 2. Loading state, 3. Button Text
  const buttonLabel = assigningText 
    ? assigningText 
    : loading 
      ? 'Updating...' 
      : updateButtonText;

  // Optimization: Check inclusion efficiently
  const shouldWrapLabel = WRAPPED_LABELS.includes(statusLabel);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-6 border-t-2 border-gray-200 bg-white rounded-xl p-5 shadow-sm">
      {/* Left side: Delete button */}
      <Button
        onClick={onDelete}
        disabled={loading}
        className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold uppercase tracking-wide shadow-md hover:shadow-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed justify-center"
      >
        Delete
      </Button>

      {/* Right side: Update button and Status toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
        <div className="flex items-center gap-3">
          <Typography
            variant="small"
            className={`font-semibold text-gray-700 ${
              shouldWrapLabel ? 'whitespace-normal leading-tight' : ''
            }`}
          >
            {statusLabel}
          </Typography>

          <button
            type="button"
            onClick={onStatusToggle}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isActive ? 'bg-blue-600' : 'bg-gray-300'
            } ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={loading}
            aria-label={isActive ? 'Active' : 'Inactive'}
            role="switch"
            aria-checked={isActive}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ease-in-out ${
                isActive ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>

          <Typography
            variant="small"
            className={isActive ? 'text-green-600 font-medium' : 'text-gray-500 font-medium'}
          >
            {isActive ? 'Active' : 'Inactive'}
          </Typography>
        </div>

        <Button
          onClick={onUpdate}
          disabled={loading || updateDisabled}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-semibold shadow-md hover:shadow-lg duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  );
}