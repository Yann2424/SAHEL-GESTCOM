import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Connexion from "../src/Modules/Auth/Connexion";
import Dash from "./Vue/Administrateur/Dash";
import DashbordResponsable from "./Vue/Responsable/DashbordResponsable";
import { AppProvider } from "./Vue/Administrateur/AppProvider";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path="/dashboard/administrateur" element={
          <AppProvider>
            <Dash />
          </AppProvider>
        } />
        <Route path="/dashboard/responsable" element={<DashbordResponsable />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
