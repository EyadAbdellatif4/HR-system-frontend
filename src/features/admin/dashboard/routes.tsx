import {
  UserCircleIcon,
  CubeIcon,        
} from "@heroicons/react/24/solid";
import { LayoutGrid, Users } from "lucide-react";
import { AssetsPage } from '../assets';
import { EmployeesPage } from '../users';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from '../profile';

const iconConfig = {
  className: "w-5 h-5 text-inherit",
};

export const adminRoutes = [
  {
    icon: <LayoutGrid className="w-5 h-5 text-inherit" />,          
    name: "dashboard",
    path: "/home",  
    element: <DashboardPage />,
  },
  {
    icon: <UserCircleIcon {...iconConfig} />,     
    name: "profile",                               
    path: "/profile",                              
    element: <ProfilePage />,                           
  },
  {
    icon: <Users className="w-5 h-5 text-inherit" />,
    name: "employees",
    path: "/employees",
    element: <EmployeesPage />,
  },
  {
    icon: <CubeIcon {...iconConfig} />,
    name: "assets",
    path: "/assets",
    element: <AssetsPage />,
  },
];

