import React from "react";

import { RouteObject } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";

type Routes = RouteObject[];

export const routes: Routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  }
];
