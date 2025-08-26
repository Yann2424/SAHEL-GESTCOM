import React, { useState } from "react";
import {
	FaWallet,
	FaMoneyBillWave,
	FaBuilding,
	FaTachometerAlt,
	FaUser,
  FaFileAlt,
} from "react-icons/fa";
import "../vue/Utilisateur.css";
import Utilisateur from "./Utilisateur";
import Departement from "./Departement";
import Budget from "./Budget"; 
import Depense from "./Depense";


const Dashboard = () => {
	const [activePage, setActivePage] = useState("utilisateur");

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
						<li onClick={() => setActivePage("depense")}>
							<FaMoneyBillWave /> Dépense
						</li>
						<li onClick={() => setActivePage("Rapport")}>
							<FaFileAlt /> Rapport
						</li>
					</ul>
				</nav>
			</aside>

			<main className="main">
				{activePage === "Utilisateur" && <Utilisateur />}
				{activePage === "Departement" && <Departement />}
				{activePage === "Budget" && <Budget />} 
				{activePage === "depense" && <Depense />} 
				{activePage === "Rapport" && <Rapport />} 
        
				{activePage === "Dash" && (
					<h2 style={{ color: "#0B3D91" }}></h2>
				)}
				{activePage === "Budget" && (
					<h2 style={{ color: "#0B3D91" }}></h2>
				)}
				{activePage === "depense" && (
					<h2 style={{ color: "#0B3D91" }}></h2>
				)}
				{activePage === "Rapport" && (
					<h2 style={{ color: "#0B3D91" }}></h2>
				)}
			</main>
		</div>
	);
};

export default Dashboard;