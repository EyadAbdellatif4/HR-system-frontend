import { ArrowRightOnRectangleIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import { SignInPage } from "./pages/SignInPage";
import { RegisterPage } from "./pages/RegisterPage";

const iconConfig = {
  className: "w-5 h-5 text-inherit",
};

export const authRoutes = [
  {
    icon: <ArrowRightOnRectangleIcon {...iconConfig} />,
    name: "sign in",
    path: "/sign-in",
    element: <SignInPage />,
  },
  {
    icon: <UserPlusIcon {...iconConfig} />,
    name: "register",
    path: "/register",
    element: <RegisterPage />,
  },
];

