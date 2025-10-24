import React from "react";
import { Link, useLocation } from "react-router-dom";

//import images
// import logoSm from "assets/images/logo-sm.png";
// import logoDark from "assets/images/logo-dark.png";
// import logoLight from "assets/images/logo-light.png";
import logoDarkSm from "assets/images/logo/logo5-sm.png";
import logoLightSm from "assets/images/logo/logo6-sm.png";
import logoDark from "assets/images/logo/logo5.png";
import logoLight from "assets/images/logo/logo6.png";
import logoVerifyNK from "assets/images/logo/logo_verify_nk.png";

import VerticalLayout from "../VerticalLayout/Index";
import withRouter from "Common/withRouter";
import SimpleBar from "simplebar-react";
import HorizontalLayout from "Layout/HorizontalLayout";

const Sidebar = ({ layoutType, layoutSidebarSizeType }: any) => {
  const location = useLocation();

  // Helper function to check if a route is active
  const isRouteActive = (link: string): boolean => {
    if (!link) return false;

    // Remove query strings and hash from current path
    const currentPath = location.pathname.split("?")[0].split("#")[0];

    // Handle exact matches
    if (currentPath === link) return true;

    // Handle dynamic routes
    const routeParts = link.split("/");
    const currentParts = currentPath.split("/");

    // If parts length doesn't match and it's not a sub-route, return false
    if (currentParts.length < routeParts.length) return false;

    // Check if current path starts with the link (for sub-routes)
    if (currentPath.startsWith(link)) {
      // If they're the same length, it's an exact match
      if (currentParts.length === routeParts.length) return true;

      // If current path is longer, ensure the next character is a slash
      // This prevents '/products' from matching '/productive'
      if (currentPath.charAt(link.length) === "/") return true;
    }

    return false;
  };

  return (
    <React.Fragment>
      <div
        className={` app-menu w-vertical-menu bg-vertical-menu ltr:border-r rtl:border-l border-vertical-menu-border fixed bottom-0 top-0 z-[1003] transition-all duration-75 ease-linear group-data-[sidebar-size=md]:w-vertical-menu-md group-data-[sidebar-size=sm]:w-vertical-menu-sm group-data-[sidebar-size=sm]:pt-header group-data-[sidebar=dark]:bg-vertical-menu-dark group-data-[sidebar=dark]:border-vertical-menu-dark group-data-[sidebar=brand]:bg-vertical-menu-brand group-data-[sidebar=brand]:border-vertical-menu-brand group-data-[sidebar=modern]:bg-gradient-to-tr group-data-[sidebar=modern]:to-vertical-menu-to-modern group-data-[sidebar=modern]:from-vertical-menu-form-modern group-data-[layout=horizontal]:w-full group-data-[layout=horizontal]:bottom-auto group-data-[layout=horizontal]:top-header md:block print:hidden group-data-[sidebar-size=sm]:absolute group-data-[sidebar=modern]:border-vertical-menu-border-modern group-data-[layout=horizontal]:dark:bg-zink-700 group-data-[layout=horizontal]:border-t group-data-[layout=horizontal]:dark:border-zink-500 group-data-[layout=horizontal]:border-r-0 group-data-[sidebar=dark]:dark:bg-zink-700 group-data-[sidebar=dark]:dark:border-zink-600 group-data-[layout=horizontal]:group-data-[navbar=scroll]:absolute group-data-[layout=horizontal]:group-data-[navbar=bordered]:top-[calc(theme('spacing.header')_+_theme('spacing.4'))] group-data-[layout=horizontal]:group-data-[navbar=bordered]:inset-x-4 group-data-[layout=horizontal]:group-data-[navbar=hidden]:top-0 group-data-[layout=horizontal]:group-data-[navbar=hidden]:h-16 group-data-[layout=horizontal]:group-data-[navbar=bordered]:w-[calc(100%_-_2rem)] group-data-[layout=horizontal]:group-data-[navbar=bordered]:[&.sticky]:top-header group-data-[layout=horizontal]:group-data-[navbar=bordered]:rounded-b-md group-data-[layout=horizontal]:shadow-md group-data-[layout=horizontal]:shadow-slate-500/10 group-data-[layout=horizontal]:dark:shadow-zink-500/10 hidden ${
          layoutType === "vertical"
            ? "group-data-[layout=horizontal]:opacity-0"
            : ""
        }`}
      >
        <div className="flex items-center justify-center px-5 text-center h-header group-data-[layout=horizontal]:hidden group-data-[sidebar-size=sm]:fixed group-data-[sidebar-size=sm]:top-0 group-data-[sidebar-size=sm]:bg-vertical-menu group-data-[sidebar-size=sm]:group-data-[sidebar=dark]:bg-vertical-menu-dark group-data-[sidebar-size=sm]:group-data-[sidebar=brand]:bg-vertical-menu-brand group-data-[sidebar-size=sm]:group-data-[sidebar=modern]:bg-vertical-menu-modern group-data-[sidebar-size=sm]:z-10 group-data-[sidebar-size=sm]:w-[calc(theme('spacing.vertical-menu-sm')_-_1px)] group-data-[sidebar-size=sm]:group-data-[sidebar=dark]:dark:bg-zink-700">
          <Link
            to="/"
            className={`group-data-[sidebar=dark]:hidden group-data-[sidebar=brand]:hidden group-data-[sidebar=modern]:hidden ${
              isRouteActive("/") ? "active" : ""
            }`}
          >
            <span className="hidden group-data-[sidebar-size=sm]:block">
              <img
                src={logoDarkSm}
                alt=""
                className="h-10 mx-auto object-cover"
              />
            </span>
            <span className="group-data-[sidebar-size=sm]:hidden">
              <img
                src={logoDark}
                alt=""
                className="h-20 mx-auto object-cover"
              />
            </span>
          </Link>
          <Link
            to="/"
            className={`hidden group-data-[sidebar=dark]:block group-data-[sidebar=brand]:block group-data-[sidebar=modern]:block ${
              isRouteActive("/") ? "active" : ""
            }`}
          >
            <span className="hidden group-data-[sidebar-size=sm]:block">
              <img
                src={logoLightSm}
                alt=""
                className="h-10 mx-auto object-cover"
              />
            </span>
            <span className="group-data-[sidebar-size=sm]:hidden">
              <img
                src={logoLight}
                alt=""
                className="h-20 mx-auto object-cover"
              />
            </span>
          </Link>
          <button
            type="button"
            className="hidden p-0 float-end"
            id="vertical-hover"
          >
            <i className="ri-record-circle-line"></i>
          </button>
        </div>

        {layoutType === "vertical" && layoutSidebarSizeType !== "sm" ? (
          <SimpleBar
            id="scrollbar"
            className="group-data-[sidebar-size=md]:max-h-[calc(100vh_-_theme('spacing.header')_*_1.2)] group-data-[sidebar-size=lg]:max-h-[calc(100vh_-_theme('spacing.header')_*_1.2)] group-data-[layout=horizontal]:h-56 group-data-[layout=horizontal]:md:h-auto group-data-[layout=horizontal]:overflow-auto group-data-[layout=horizontal]:md:overflow-visible group-data-[layout=horizontal]:max-w-screen-2xl group-data-[layout=horizontal]:mx-auto"
          >
            <div>
              <ul
                className="group-data-[layout=horizontal]:flex group-data-[layout=horizontal]:flex-col group-data-[layout=horizontal]:md:flex-row"
                id="navbar-nav"
              >
                <VerticalLayout isRouteActive={isRouteActive} />
              </ul>
            </div>
          </SimpleBar>
        ) : (
          <div
            id="scrollbar"
            className="group-data-[sidebar-size=md]:max-h-[calc(100vh_-_theme('spacing.header')_*_1.2)] group-data-[sidebar-size=lg]:max-h-[calc(100vh_-_theme('spacing.header')_*_1.2)] group-data-[layout=horizontal]:h-56 group-data-[layout=horizontal]:md:h-auto group-data-[layout=horizontal]:overflow-auto group-data-[layout=horizontal]:md:overflow-visible group-data-[layout=horizontal]:max-w-screen-2xl group-data-[layout=horizontal]:mx-auto"
          >
            <div>
              <ul
                className="group-data-[layout=horizontal]:flex group-data-[layout=horizontal]:flex-col group-data-[layout=horizontal]:md:flex-row"
                id="navbar-nav"
              >
                <HorizontalLayout isRouteActive={isRouteActive} />
              </ul>
            </div>
          </div>
        )}

        {/* Bottom Logo Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-vertical-menu-border group-data-[sidebar=dark]:border-vertical-menu-border-dark group-data-[sidebar=brand]:border-vertical-menu-border-brand group-data-[sidebar=modern]:border-vertical-menu-border-modern group-data-[sidebar=dark]:dark:border-zink-600 bg-vertical-menu group-data-[sidebar=dark]:bg-vertical-menu-dark group-data-[sidebar=brand]:bg-vertical-menu-brand group-data-[sidebar=modern]:bg-gradient-to-tr group-data-[sidebar=modern]:to-vertical-menu-to-modern group-data-[sidebar=modern]:from-vertical-menu-form-modern group-data-[sidebar=dark]:dark:bg-zink-700">
          <div className="flex flex-col items-center text-center group-data-[sidebar-size=sm]:hidden">
            <img
              src={logoVerifyNK}
              alt="Ngân Kim Trading Company Limited"
              className="h-20 mx-auto object-contain transition-opacity duration-200 hover:opacity-80"
            />
            <div className="text-xs font-medium text-vertical-menu-item group-data-[sidebar=dark]:text-vertical-menu-item-dark group-data-[sidebar=brand]:text-vertical-menu-item-brand group-data-[sidebar=modern]:text-vertical-menu-item-modern group-data-[sidebar=dark]:dark:text-zink-200 leading-tight tracking-wide opacity-90" style={{ marginTop: -5 }}>
              Ngân Kim Trading<br />Company Limited
            </div>
          </div>
          <div className="hidden group-data-[sidebar-size=sm]:flex group-data-[sidebar-size=sm]:justify-center">
            <img
              src={logoVerifyNK}
              alt="Ngân Kim Trading Company Limited"
              className="h-6 object-contain transition-opacity duration-200 hover:opacity-80"
            />
          </div>
        </div>
      </div>

      <div
        id="sidebar-overlay"
        className="absolute inset-0 z-[1002] bg-slate-500/30 hidden"
      ></div>
    </React.Fragment>
  );
};

export default withRouter(Sidebar);
