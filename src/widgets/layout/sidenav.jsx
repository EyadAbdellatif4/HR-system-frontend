import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAppSelector, useAppDispatch } from "@/store";
import { setOpenSidenav } from "@/store/slices/uiSlice";

export function Sidenav({ brandImg, brandName, routes }) {
  const dispatch = useAppDispatch();
  const openSidenav = useAppSelector((state) => state.ui.openSidenav);

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {openSidenav && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-150"
          onClick={() => dispatch(setOpenSidenav(false))}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-150 ease-in-out flex flex-col ${
          openSidenav ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="relative flex items-center justify-center min-h-[120px] border-b border-gray-200 px-2">
          <div className="flex flex-col items-center justify-center w-full">
            <img
              src="/Emails.svg"
              alt="Email System"
              className="h-28 sm:h-32 w-auto max-w-[250px]"
            />
          </div>
          {/* Mobile Close Button */}
          <button
            onClick={() => dispatch(setOpenSidenav(false))}
            className="lg:hidden absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors touch-manipulation z-10"
            aria-label="Close sidebar"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 sm:px-4 mt-4 sm:mt-6 min-h-0">
          <div className="space-y-1 sm:space-y-2">
            {routes.map(({ layout, title, pages }, key) => (
              <div key={key}>
                {pages.map(({ icon, name, path }) => (
                  <NavLink
                    key={name}
                    to={`/${layout}${path}`}
                    onClick={() => dispatch(setOpenSidenav(false))}
                    className={({ isActive }) =>
                      `flex items-center px-3 sm:px-4 py-5 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors touch-manipulation min-h-[44px] ${
                        isActive
                          ? "text-blue-600 bg-blue-50 border-r-4 border-blue-600"
                          : ""
                      }`
                    }
                  >
                    <span className="w-5 h-5 mr-2 sm:mr-3 flex-shrink-0 flex items-center justify-center [&>svg]:w-5 [&>svg]:h-5">
                      {icon}
                    </span>
                    <span className="font-medium text-sm sm:text-base capitalize">
                      {name}
                    </span>
                  </NavLink>
                ))}
              </div>
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
