import React, { useContext } from "react";
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
	ResponsiveContainer,
	LineChart,
	Line,
	XAxis,
	YAxis,
	Legend,
} from "recharts";
import { useState } from "react";

import "../Administrateur/Dash.css";
import Utilisateur from "../Administrateur/Utilisateur";
import Departement from "../Administrateur/Departement";
import Budget from "../Administrateur/Budget";
import Depense from "../Administrateur/Depense";
import Rapport from "../Administrateur/Rapport";
import { AppContext } from "../Administrateur/AppContext";

const Dashboard = () => {
	const [activePage, setActivePage] = React.useState("Dash");
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const { users, departments, budgets, reports, expenses } =
		useContext(AppContext);

	const totalExpenses =
		expenses.reduce((acc, e) => acc + (e.montant || 0), 0) +
		users.reduce(
			(acc, u) => acc + u.expenses.reduce((s, ex) => s + ex.montant, 0),
			0
		) +
		reports.reduce((acc, r) => acc + (r.depense || 0), 0);

	const budgetParDepartement = departments.map((d) => ({
		name: d.nom,
		budget: budgets
			.filter((b) => b.departementId === d.id)
			.reduce((s, b) => s + b.montant, 0),
	}));

	const depenseParBudget = budgets.map((b) => ({
		name: b.nom,
		depense: expenses
			.filter((e) => e.budgetId === b.id)
			.reduce((s, e) => s + e.montant, 0),
	}));


	const COLORS = ["#0B3D91", "#e74c3c", "#27ae60", "#f39c12", "#8e44ad"];

	return (
		<div className="dashboard">
			{/* Bouton Hamburger */}
			<button
				className="hamburger"
				onClick={() => setSidebarOpen(!sidebarOpen)}
			></button>
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

						{/* Statistiques globales */}
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
