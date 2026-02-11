import { StrictMode } from "react";

import { PrimeReactProvider } from "primereact/api";
import { createRoot } from "react-dom/client";

import { App } from "./components/App";

import "./index.css";
import "primereact/resources/themes/md-dark-deeppurple/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <PrimeReactProvider>
            <App />
        </PrimeReactProvider>
    </StrictMode>,
);
