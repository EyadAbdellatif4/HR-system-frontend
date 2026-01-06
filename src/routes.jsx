
import { adminRoutes } from "@/modules/admin/routes";
import { authRoutes } from "@/modules/auth/routes";

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
export { adminRoutes };
