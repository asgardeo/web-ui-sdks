import ReactDOM from "react-dom/client";
import App from "./App.tsx";
//import { AsgardeoProvider, UIAuthConfig } from "../../../packages/react/src"; //TODO: temporary
import { AsgardeoProvider, UIAuthConfig } from "@asgardeo/react-ui";

const config: UIAuthConfig = {
  baseUrl: "https://localhost:9443",
  clientID: "b1uRjwpqydvxjGR42Y6BnIdQMRMa",
  scope: ["openid", "internal_login", "profile"],
  signInRedirectURL: "https://localhost:5173",
  enableConsoleTextBranding: true,
};

const devConfig: UIAuthConfig = {
  baseUrl: "https://dev.api.asgardeo.io/t/movinorg",
  clientID: "kH5OfXOvpGLOvp1iAw4zQmNvv4oa",
  scope: ["openid", "internal_login", "profile"],
  signInRedirectURL: "https://localhost:5173",
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <AsgardeoProvider config={config}>
    <App />
  </AsgardeoProvider>
);
