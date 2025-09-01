import React, { useEffect, useState } from "react";
import {
  FaWallet,
  FaMoneyBillWave,
  FaBuilding,
  FaTachometerAlt,
  FaUser,
  FaFileAlt,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
} from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../Modules/firebase/firebase";
import "../Administrateur/Dash.css";
import Utilisateur from "../Administrateur/Utilisateur";
import Departement from "../Administrateur/Departement";
import Budget from "../Administrateur/Budget";
import Depense from "../Administrateur/Depense";
import Rapport from "../Administrateur/Rapport";

const Dashboard = () => {
  const [activePage, setActivePage] = useState("Dash");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDepartments: 0,
    totalBudgets: 0,
    totalExpenses: 0,
    totalReports: 0,
  });
  const [departments, setDepartments] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#0B3D91", "#e74c3c", "#27ae60", "#f39c12", "#8e44ad", "#16a085", "#c0392b"];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Utilisateurs
        const usersSnapshot = await getDocs(collection(db, "Utilisateurs"));
        const users = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Départements
        const depSnapshot = await getDocs(collection(db, "Departements"));
        const depData = depSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Budgets
        const budgetsSnapshot = await getDocs(collection(db, "Budgets"));
        const budgetData = budgetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Dépenses
        const expensesSnapshot = await getDocs(collection(db, "Depenses"));
        const expenseData = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Rapports
        const reportsSnapshot = await getDocs(collection(db, "Rapports"));
        const reports = reportsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // Calcul total dépenses
        const totalExpensesAmount = expenseData.reduce((acc, e) => acc + (e.montant || 0), 0);

        // Mettre à jour les stats
        setStats({
          totalUsers: users.length,
          totalDepartments: depData.length,
          totalBudgets: budgetData.length,
          totalExpenses: totalExpensesAmount,
          totalReports: reports.length,
        });

        setDepartments(depData);
        setBudgets(budgetData);
        setExpenses(expenseData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur récupération données Firebase :", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="dashboard">
        <main className="main">
          <h2>Chargement des données...</h2>
        </main>
      </div>
    );
  }

  const budgetParDepartement = departments.map(dep => {
    const totalBudget = budgets
      .filter(b => b.departementId === dep.id)
      .reduce((sum, b) => sum + (b.montant || 0), 0);
    return { name: dep.nom || dep.name, budget: totalBudget };
  });

  const depenseParBudget = budgets.map(b => {
    const totalDepense = expenses
      .filter(e => e.budgetId === b.id)
      .reduce((sum, e) => sum + (e.montant || 0), 0);
    return { name: b.nom || b.name, depense: totalDepense };
  });

  return (
    <div className="dashboard">
      {/* Bouton Hamburger */}
      <button
        className="hamburger"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      ></button>

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
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
                <h3>{stats.totalUsers}</h3>
                <p>Utilisateurs</p>
              </div>
              <div className="stat-card departement">
                <FaBuilding className="stat-icon" />
                <h3>{stats.totalDepartments}</h3>
                <p>Départements</p>
              </div>
              <div className="stat-card budget">
                <FaWallet className="stat-icon" />
                <h3>{stats.totalBudgets}</h3>
                <p>Budgets</p>
              </div>
              <div className="stat-card rapport">
                <FaFileAlt className="stat-icon" />
                <h3>{stats.totalReports}</h3>
                <p>Rapports</p>
              </div>
              <div className="stat-card depense">
                <FaMoneyBillWave className="stat-icon" />
                <h3>{stats.totalExpenses.toLocaleString()} F</h3>
                <p>Total Dépenses</p>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-wrapper">
                <h3>Budgets par Département</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={budgetParDepartement}
                      dataKey="budget"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label
                    >
                      {budgetParDepartement.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-wrapper">
                <h3>Dépenses par Budget</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={depenseParBudget}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="depense"
                      stroke="#e74c3c"
                      strokeWidth={2}
                    />
                  </LineChart>
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
