declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

import { createRootRoute, createRouter } from "@tanstack/react-router";
import { AppContextType } from "./types";
import RootComponent from "./src/components/RootComponent";
import { appContextInitialData } from "./src/lib/const";
import { dashboardRoute } from "./src/routes/DashboardRoute";
import { dataRoute } from "./src/routes/DataRoute";
import { indexRoute } from "./src/routes/IndexRoute";
import { createContext, useContext } from "react";

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
export const rootRoute = createRootRoute({
  component: RootComponent,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  dataRoute,
]);

export const router = createRouter({
  routeTree,
  context: appContextInitialData,
});
