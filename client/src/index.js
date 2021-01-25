import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "@fortawesome/fontawesome-free/css/all.css";

ReactDOM.render(
  <BrowserRouter>
    <ChakraProvider>
      <App />
    </ChakraProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals();
