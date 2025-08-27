import React, { useContext } from "react";
import {
  FaWallet,
  FaMoneyBillWave,
  FaBuilding,
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
} from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

import "../vue/Utilisateur.css";
import Utilisateur from "./Utilisateur";
import Departement from "./Departement";
import Budget from "./Budget";
import Depense from "./Depense";
import Rapport from "./Rapport";
import { AppContext } from "../Vue/AppContext";

const Dashboard = () => {
  const [activePage, setActivePage] = React.useState("Dash");
  const { users, departments, budgets, reports, expenses } = useContext(AppContext);

  const totalExpenses =
    expenses.reduce((acc, e) => acc + (e.montant || 0), 0) +
    users.reduce((acc, u) => acc + u.expenses.reduce((s, ex) => s + ex.montant, 0), 0) +
    reports.reduce((acc, r) => acc + (r.depense || 0), 0);

  const budgetData = budgets.map(b => ({ name: b.nom, montant: b.montant }));
  const expenseData = expenses.map(e => ({ name: e.nom, montant: e.montant }));

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="logo-container">
          <div className="logo-placeholder">GESCOM</div>
        </div>
        <nav>
          <ul>
            <li onClick={() => setActivePage("Dash")}>
              <FaTachometerAlt /> Dashboard
            </li>
            <li onClick={() => setActivePage("Utilisateur")}>
              <FaUser /> Utilisateur
            </li>
            <li onClick={() => setActivePage("Departement")}>
              <FaBuilding /> Département
            </li>
            <li onClick={() => setActivePage("Budget")}>
              <FaWallet /> Budget
            </li>
            <li onClick={() => setActivePage("Depense")}>
              <FaMoneyBillWave /> Dépense
            </li>
            <li onClick={() => setActivePage("Rapport")}>
              <FaFileAlt /> Rapport
            </li>
          </ul>
        </nav>
      </aside>

      <main className="main">
        {activePage === "Dash" && (
          <div>
            <h2 style={{ marginBottom: "20px", color: "#0B3D91" }}>
              Tableau de bord général
            </h2>
            <div className="stats-cards">
              <div className="stat-card user">
                <FaUser className="stat-icon" />
                <h3>{users.length}</h3>
                <p>Utilisateurs</p>
              </div>
              <div className="stat-card departement">
                <FaBuilding className="stat-icon" />
                <h3>{departments.length}</h3>
                <p>Départements</p>
              </div>
              <div className="stat-card budget">
                <FaWallet className="stat-icon" />
                <h3>{budgets.length}</h3>
                <p>Budgets</p>
              </div>
              <div className="stat-card rapport">
                <FaFileAlt className="stat-icon" />
                <h3>{reports.length}</h3>
                <p>Rapports</p>
              </div>
              <div className="stat-card depense">
                <FaMoneyBillWave className="stat-icon" />
                <h3>{totalExpenses.toLocaleString()} F</h3>
                <p>Total Dépenses</p>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-wrapper">
                <h3>Graphique des Budgets</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={budgetData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="montant" fill="#0B3D91" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-wrapper">
                <h3>Graphique des Dépenses</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expenseData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="montant" fill="#e74c3c" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activePage === "Utilisateur" && <Utilisateur />}
        {activePage === "Departement" && <Departement />}
        {activePage === "Budget" && <Budget />}
        {activePage === "Depense" && <Depense />}
        {activePage === "Rapport" && <Rapport />}
      </main>
    </div>
  );
};

export default Dashboard;