import React from "react";

import { Navigate, RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Registration from "./pages/Registration";

type Routes = RouteObject[];

export const routes: Routes = [
  {
    path: "/app",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/registration",
    element: <Registration />
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,

  }
];
