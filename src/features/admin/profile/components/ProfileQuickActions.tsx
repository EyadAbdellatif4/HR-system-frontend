import React from 'react';
import {
  Typography,
  Button,
  Card,
  CardBody,
} from '@material-tailwind/react';
import {
  PencilIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export function ProfileQuickActions({ onEditClick }) {
  return (
    <Card className="shadow-lg border border-gray-200 h-full">
      <CardBody className="p-6">
        <Typography variant="h6" className="text-gray-900 font-bold mb-6">
          Quick Actions
        </Typography>
        
        <div className="space-y-4">
          <Button
            variant="outlined"
            color="blue"
            fullWidth
            onClick={onEditClick}
            className="flex items-center justify-center gap-2 border-2 border-blue-300 text-blue-700 hover:bg-blue-50 transition-all duration-200"
          >
            <PencilIcon className="w-5 h-5" />
            Update Profile
          </Button>

          <div className="pt-4 border-t border-gray-200">
            <Typography variant="small" className="text-gray-600 font-semibold mb-3 block">
              Account Security
            </Typography>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                  <Typography variant="small" className="text-gray-700">
                    Password
                  </Typography>
                </div>
                <span className="text-xs font-medium text-green-600">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

