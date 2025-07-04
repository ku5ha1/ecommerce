import React from "react";
import { BrowserRouter } from "react-router-dom";
import RouteTree from "./routes/RouteTree";

function App() {
  return (
    <BrowserRouter>
      <RouteTree />
    </BrowserRouter>
  );
}

export default App;