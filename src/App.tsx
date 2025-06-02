import React from "react";
import { routes } from "./routes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "styles.css";
import { Provider } from "react-redux";
import { store } from "./store";
import ConfigProvider from "antd/es/config-provider";

const router = createBrowserRouter(routes);

const App = () => {
    return (
        <ConfigProvider>
            <Provider store={store}>
                <React.StrictMode>
                    <RouterProvider router={router} />
                </React.StrictMode>
            </Provider>
        </ConfigProvider>
    );
};
export default App;
