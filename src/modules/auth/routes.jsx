import { ArrowRightOnRectangleIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { SignIn, Register } from "./pages";

const iconConfig = {
  className: "w-5 h-5 text-inherit",
};

export const authRoutes = [
  {
    icon: <ArrowRightOnRectangleIcon {...iconConfig} />,
    name: "sign in",
    path: "/sign-in",
    element: <SignIn />,
  },
  {
    icon: <UserPlusIcon {...iconConfig} />,
    name: "register",
    path: "/register",
    element: <Register />,
  },
];

