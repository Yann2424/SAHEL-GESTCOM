import React, { useEffect, useState } from "react";
import {
	FaWallet,
	FaMoneyBillWave,
	FaBuilding,
	FaTachometerAlt,
	FaUser,
	FaFileAlt,
	FaSignOutAlt,
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
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../Modules/firebase/firebase";
import { useNavigate } from "react-router-dom";

import "./Dash.css";
import Utilisateur from "./Utilisateur";
import Departement from "./Departement";
import Budget from "./Budget";
import Depense from "./Depense";
import Rapport from "./Rapport";

const Dashboard = () => {
	const navigate = useNavigate();
	const [activePage, setActivePage] = useState("Dash");
	const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar ouvert par défaut
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
	const [username, setUsername] = useState("");

	

	
	const COLORS = [
		"#0B3D91",
		"#e74c3c",
		"#27ae60",
		"#f39c12",
		"#8e44ad",
		"#16a085",
		"#c0392b",
	];

	// Vérification de connexion
	useEffect(() => {
		const user = localStorage.getItem("username");
		if (!user) {
			navigate("/connexion");
		} else {
			setUsername(user);
		}
	}, [navigate]);

	// Récupération temps réel depuis Firebase
	useEffect(() => {
		const unsubUsers = onSnapshot(
			collection(db, "Utilisateurs"),
			(snapshot) => {
				const users = snapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setStats((prev) => ({ ...prev, totalUsers: users.length }));
			}
		);

		const unsubDeps = onSnapshot(collection(db, "Departements"), (snapshot) => {
			const depData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setDepartments(depData);
			setStats((prev) => ({ ...prev, totalDepartments: depData.length }));
		});

		const unsubBudgets = onSnapshot(collection(db, "Budgets"), (snapshot) => {
			const budgetData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setBudgets(budgetData);
			setStats((prev) => ({ ...prev, totalBudgets: budgetData.length }));
		});

		const unsubExpenses = onSnapshot(collection(db, "Depenses"), (snapshot) => {
			const expenseData = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setExpenses(expenseData);
			const totalExpensesAmount = expenseData.reduce(
				(acc, e) => acc + (e.montant || 0),
				0
			);
			setStats((prev) => ({ ...prev, totalExpenses: totalExpensesAmount }));
		});

		const unsubReports = onSnapshot(collection(db, "Rapports"), (snapshot) => {
			const reports = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setStats((prev) => ({ ...prev, totalReports: reports.length }));
		});

		setLoading(false);

		return () => {
			unsubUsers();
			unsubDeps();
			unsubBudgets();
			unsubExpenses();
			unsubReports();
		};
	}, []);

	// Déconnexion
	const handleLogout = () => {
		localStorage.removeItem("username");
		navigate("/connexion");
	};

	if (loading) {
		return (
			<div className="dashboard">
				<main className="main">
					<h2>Chargement des données...</h2>
				</main>
			</div>
		);
	}

	 const budgetParDepartement = departments.map((dep) => {
	 	const totalBudget = budgets
	 		.filter((b) => b.departement === (dep.nom || dep.name))
	 		.reduce((sum, b) => sum + (Number(b.montant || 0)), 0);
	 	return { name: dep.nom || dep.name, budget: totalBudget };
	 });

	
	 const depenseParBudget = budgets.map((b) => {
	 	const totalDepense = expenses
	 		.filter((e) => e.budgetId === b.id)
			.reduce((sum, e) => sum + (e.montant || 0), 0);
	 	return { name: b.departement || b.name, depense: totalDepense };
	 });
	 console.log(depenseParBudget,"depenseParBudget",budgets);
	return (
		<div className="dashboard">
			{/* Sidebar */}
			<aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
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

				<div className="mt-auto px-4 pb-4">
					<button
						onClick={handleLogout}
						className="flex items-center gap-2 w-full bg-gradient-to-r from-orange-500 to-blue-600 text-white font-semibold px-4 py-2 rounded-xl shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
					>
						<FaSignOutAlt className="text-lg" />
						Déconnexion
					</button>
				</div>
			</aside>

			{/* Bouton Hamburger */}
			<button
				className="hamburger"
				onClick={() => setSidebarOpen(!sidebarOpen)}
			>
				☰
			</button>

			{/* Main */}
			<main className="main">
				{activePage === "Dash" && (
					<div>
						<h2 style={{ color: "#0B3D91", marginBottom: "10px" }}>
							Bienvenue, <span style={{ color: "#f29544" }}>{username}</span> !
						</h2>
						<p style={{ marginBottom: "20px", fontSize: "16px" }}>
							Vous êtes connecté sur le tableau de bord de GESCOM. Gérez vos
							utilisateurs, départements, budgets, dépenses et rapports en toute
							simplicité.
						</p>

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
										{budgetParDepartement.map((entry, index) => (
  											<Cell
    										key={entry.name}
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
