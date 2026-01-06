import { adminRoutes } from "@/features/admin/dashboard/routes";
import { authRoutes } from "@/features/auth/routes";

const routes = [
  {
    layout: "dashboard",
    pages: [...adminRoutes],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [...authRoutes],
  },
];

export default routes;
export { adminRoutes, authRoutes };
