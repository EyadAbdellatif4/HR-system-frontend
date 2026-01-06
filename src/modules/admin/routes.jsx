import {
  UserCircleIcon,
  CubeIcon,        
} from "@heroicons/react/24/solid";
import { LayoutGrid, Users } from "lucide-react";
import { Home, Profile, Assets, Employees } from "./pages";

const iconConfig = {
  className: "w-5 h-5 text-inherit",
};

export const adminRoutes = [
  {
    icon: <LayoutGrid className="w-5 h-5 text-inherit" />,          
    name: "dashboard",
    path: "/home",  
    element: <Home />,
  },
  {
    icon: <UserCircleIcon {...iconConfig} />,     
    name: "profile",                               
    path: "/profile",                              
    element: <Profile />,                           
  },
  {
    icon: <Users className="w-5 h-5 text-inherit" />,
    name: "employees",
    path: "/employees",
    element: <Employees />,
  },
  {
    icon: <CubeIcon {...iconConfig} />,
    name: "assets",
    path: "/assets",
    element: <Assets />,
  },
];

