import React, { useEffect, useMemo, useState, useContext } from "react";
import {
	FaSitemap,
	FaWallet,
	FaFileInvoiceDollar,
	FaRegFileAlt,
	FaPlus,
	FaTrash,
	FaDownload,
	FaPaperPlane,
	FaSignOutAlt,
	FaBars,
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./DashbordResponsable.css";
import { GetDepartementFUser } from "../../Modules/UtilisateurR/Departement/DepartementRes";
import {
	DepenseFUser,
	GetDepenseFUser,
	DeleteDepenseFUser,
} from "../../Modules/UtilisateurR/Depense/DepenseRes";
import { GetbudgetFDepar } from "../../Modules/UtilisateurR/Budget/BudgetsRes";
import { LogOut } from "../../Modules/UtilisateurR/Auth/Connexion";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Administrateur/AppContext";
import {
	NewRapportFUser,
	GetRapports,
	ValideRapport,
	// refuserRapport,
	GetRapportFUser,
} from "../../Modules/UtilisateurR/Rapport/RapportR"; // adapte le chemin selon ton projet

export default function DashboardResponsable() {
	const { currentUser } = useContext(AppContext);
	const [activeTab, setActiveTab] = useState("departement");
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const [depenseForm, setDepenseForm] = useState({
		montant: "",
		date: "",
		motif: "",
		type: "",
	});

	const [depenses, setDepenses] = useState([]);
	// const [rapport, setRapport] = useState("");
	const [adminEmail] = useState("admin@entreprise.com");

	const [assignedDepartment, setAssignedDepartment] = useState("");
	const [responsableName, setResponsableName] = useState("");
	const [assignedBudget, setAssignedBudget] = useState(0);

	// --- Récupérer les infos utilisateur, budget et dépenses ---
	useEffect(() => {
		console.log("currentUser:", currentUser);
		if (!currentUser?.email) {
			console.log("users existe-pas");
			return;
		}
		const fetchUserData = async () => {
			// Département
			const departement = await GetDepartementFUser({
				email: currentUser.email,
			});
			setAssignedDepartment(departement || "Non attribué");
			setResponsableName(currentUser.displayName || "Nom non défini");

			// Budget lié au département
			if (departement) {
				const budget = await GetbudgetFDepar({ departement });
				setAssignedBudget(budget || 0);
			}

			// Dépenses de l’utilisateur
			const userData = await GetDepenseFUser({ email: currentUser.email });
			setDepenses(userData?.expenses || []);
			setRapport(userData?.rapport || "");
		};
		fetchUserData();
	}, [currentUser]);

	const totalDepenses = useMemo(
		() => depenses.reduce((sum, d) => sum + Number(d.montant || 0), 0),
		[depenses]
	);
	const resteBudget = Math.max(assignedBudget - totalDepenses, 0);
	const progressPct = assignedBudget
		? Math.min((totalDepenses / assignedBudget) * 100, 100)
		: 0;

	// --- Ajouter une dépense ---
	const handleAddDepense = async (e) => {
		e.preventDefault();
		const { montant, date, motif, type } = depenseForm;
		if (!montant || !date || !motif)
			return alert("Veuillez remplir tous les champs.");
		if (Number(montant) <= 0)
			return alert("Le montant doit être supérieur à 0.");

		const depense = {
			montant: Number(montant),
			date,
			motif,
			type,
			email: currentUser.email,
		};

		try {
			await DepenseFUser(depense);
			setDepenses((prev) => [depense, ...prev]);
			setDepenseForm({ montant: "", date: "", motif: "", type: "" });
		} catch (err) {
			console.log("Erreur ajout dépense:", err);
		}
	};

	// --- Supprimer une dépense ---
	const handleDelete = async (depense) => {
		try {
			await DeleteDepenseFUser({ email: currentUser.email }, depense.id);
			setDepenses((prev) => prev.filter((d) => d.id !== depense.id));
		} catch (err) {
			console.log("Erreur suppression dépense:", err);
		}
	};

	// --- Export PDF ---
	const exportPDF = () => {
		const doc = new jsPDF({ unit: "pt", format: "a4" });
		const title = `Rapport financier – Département ${assignedDepartment}`;
		const dateStr = new Date().toLocaleDateString();

		doc.setFontSize(18);
		doc.text(title, 40, 40);
		doc.setFontSize(11);
		doc.text(`${responsableName} | Date: ${dateStr}`, 40, 62);
		doc.text(`Budget attribué: ${formatMoney(assignedBudget)} XAF`, 40, 80);
		doc.text(`Total dépenses: ${formatMoney(totalDepenses)} XAF`, 40, 96);
		doc.text(`Reste: ${formatMoney(resteBudget)} XAF`, 40, 112);

		const rows = depenses.map((d) => [
			new Date(d.date).toLocaleDateString(),
			d.motif,
			`${formatMoney(d.montant)} XAF`,
		]);

		autoTable(doc, {
			head: [["Date", "Motif", "Montant"]],
			body: rows.length ? rows : [["—", "Aucune dépense", "—"]],
			startY: 130,
			styles: { fontSize: 10, cellPadding: 6 },
			headStyles: { fillColor: [34, 197, 94] },
		});

		const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 150;
		doc.setFontSize(13);
		doc.text("Rapport du responsable:", 40, finalY);
		doc.setFontSize(11);
		const lines = doc.splitTextToSize(rapport || "(Aucun rapport saisi)", 515);
		doc.text(lines, 40, finalY + 18);

		doc.save(
			`Rapport_${assignedDepartment}_${dateStr.replaceAll("/", "-")}.pdf`
		);
	};

	// --- Envoi par mail ---
	const openEmailClient = () => {
		const subject = encodeURIComponent(
			`Rapport financier – ${assignedDepartment}`
		);
		const body = encodeURIComponent(
			`Bonjour,\n\nVeuillez trouver ci-joint le rapport financier.\n\nRésumé:\n- Budget: ${formatMoney(
				assignedBudget
			)} XAF\n- Dépenses: ${formatMoney(
				totalDepenses
			)} XAF\n- Reste: ${formatMoney(
				resteBudget
			)} XAF\n\n${rapport}\n\nCordialement,\n${responsableName}`
		);
		window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
	};

	const [rapport, setRapport] = useState("");
	const [rapports, setRapports] = useState([]);
	// --- Récupérer les rapports de l'utilisateur connecté ---
	useEffect(() => {
		if (!currentUser?.email) return;

		const fetchRapports = async () => {
			const data = await GetRapportFUser({ email: currentUser.email });
			setRapports(data || []);
		};

		fetchRapports();
	}, [currentUser]);

	const handleSendRapport = async () => {
		if (!rapport.trim())
			return alert("Veuillez rédiger un rapport avant d’envoyer.");

		try {
			await NewRapportFUser({ email: currentUser.email, rapport });
			setRapport(""); // vider le champ
			const data = await GetRapportFUser({ email: currentUser.email });
			setRapports(data || []);
			alert("Rapport soumis avec succès !");
		} catch (err) {
			console.log("Erreur lors de l'envoi du rapport :", err);
		}
	};

	return (
		<div className="min-h-screen bg-gray-100 flex">
			{/* Sidebar */}
			<aside
				className={`bg-blue shadow-xl transition-all duration-300 ${
					sidebarOpen ? "w-72" : "w-20"
				}`}
			>
				<div className="flex items-center justify-between px-4 py-4 border-b">
					<div className="flex items-center gap-2">
						<h1
							className={`font-bold text-lg tracking-wide ${
								sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
							}`}
						>
							GESCOM
						</h1>
					</div>
					<button
						className="icon-btn"
						onClick={() => setSidebarOpen((s) => !s)}
						title="Basculer le menu"
					>
						<FaBars />
					</button>
				</div>
				<nav className="p-3 space-y-2">
					<NavItem 
						icon={<FaTachometerAlt />}
						label="Dashboard"
						active={activeTab === "departement"}
						onClick={() => setActiveTab("departement")}
						expanded={sidebarOpen}
					/>
					<NavItem
						icon={<FaWallet />}
						label="Budget"
						active={activeTab === "budget"}
						onClick={() => setActiveTab("budget")}
						expanded={sidebarOpen}
					/>
					<NavItem
						icon={<FaFileInvoiceDollar />}
						label="Dépense"
						active={activeTab === "depense"}
						onClick={() => setActiveTab("depense")}
						expanded={sidebarOpen}
					/>
					<NavItem
						icon={<FaRegFileAlt />}
						label="Rapport"
						active={activeTab === "rapport"}
						onClick={() => setActiveTab("rapport")}
						expanded={sidebarOpen}
					/>
				</nav>
				<div className="mt-auto p-4 text-xs text-gray-500 border-t">
					© 2025 Gescom
				</div>
			</aside>

			{/* Main */}
			<main className="flex-1 p-6">
				<Header />

				{/* --- Tabs --- */}
				{activeTab === "departement" && (
					<section className="fade-in">
						<Cards>
							<Card title="Département assigné">
								<div className="text-2xl font-semibold">
									{assignedDepartment}
								</div>
							</Card>
							<Card title="Responsable">
								<div className="text-2xl font-semibold">{responsableName}</div>
							</Card>
						</Cards>
						<br />
						<div className="panel">
							<h3 className="panel-title">Consignes</h3>
							<p className="panel-text">
								Vous voyez ici le département qui vous a été attribué par
								l'administrateur.
							</p>
						</div>
					</section>
				)}

				{activeTab === "budget" && (
					<section className="fade-in">
						<Cards>
							<Card title="Budget attribué">
								<div className="text-3xl font-bold">
									{formatMoney(assignedBudget)}{" "}
									<span className="text-base font-medium">XAF</span>
								</div>
							</Card>
							<Card title="Total des dépenses">
								<div className="text-3xl font-bold">
									{formatMoney(totalDepenses)}{" "}
									<span className="text-base font-medium">XAF</span>
								</div>
							</Card>
							<Card title="Reste à consommer">
								<div className="text-3xl font-bold">
									{formatMoney(resteBudget)}{" "}
									<span className="text-base font-medium">XAF</span>
								</div>
							</Card>
						</Cards>
						<br />
						<div className="panel">
							<h3 className="panel-title">Progression du budget</h3>
							<div className="progress">
								<div
									className="progress-bar"
									style={{ width: `${progressPct}%` }}
								/>
							</div>
							<div className="mt-2 text-sm text-gray-600">
								{progressPct.toFixed(1)}% consommé
							</div>
						</div>
					</section>
				)}

				{activeTab === "depense" && (
					<section className="fade-in">
						{/* Formulaire et tableau */}
						<div className="panel">
							<h3 className="panel-title">Enregistrer une dépense</h3>
							<form
								className="grid md:grid-cols-12 gap-3"
								onSubmit={handleAddDepense}
							>
								<div className="md:col-span-2">
									<label className="label">Montant (XAF)</label>
									<input
										type="number"
										className="input"
										value={depenseForm.montant}
										onChange={(e) =>
											setDepenseForm({
												...depenseForm,
												montant: e.target.value,
											})
										}
										placeholder="Ex: 15000"
										required
									/>
								</div>
								<div className="md:col-span-2">
									<label className="label">Date</label>
									<input
										type="date"
										className="input"
										value={depenseForm.date}
										onChange={(e) =>
											setDepenseForm({ ...depenseForm, date: e.target.value })
										}
										required
									/>
								</div>
								<div className="md:col-span-4">
									<label className="label">Motif</label>
									<input
										type="text"
										className="input"
										value={depenseForm.motif}
										maxLength={120}
										onChange={(e) =>
											setDepenseForm({ ...depenseForm, motif: e.target.value })
										}
										placeholder="Ex: Achat de fournitures"
										required
									/>
								</div>
								<div className="md:col-span-3">
									<label className="label">Type de dépense</label>
									<select
										className="input"
										value={depenseForm.type}
										onChange={(e) =>
											setDepenseForm({ ...depenseForm, type: e.target.value })
										}
										required
									>
										<option value="">Sélectionnez un type</option>
										<option value="Fournitures">Fournitures</option>
										<option value="Transport">Transport</option>
										<option value="Logement">Logement</option>
										<option value="Restaurant">Restaurant</option>
										<option value="Technicien">Technicien</option>
										<option value="Autre">Autre</option>{" "}
									</select>
								</div>
								<div className="md:col-span-12 flex items-end">
									<button type="submit" className="btn-primary">
										<FaPlus className="mr-2" />
										Ajouter
									</button>
								</div>
							</form>
						</div>
						<div className="panel mt-4">
							<h3 className="panel-title">Historique des dépenses</h3>
							<div className="table-wrap">
								<table className="table">
									<thead>
										<tr>
											<th>Date</th>
											<th>Motif</th>
											<th>Type</th>
											<th className="text-right">Montant (XAF)</th>
											<th>Option</th>
										</tr>
									</thead>
									<tbody>
										{depenses.length === 0 && (
											<tr>
												<td colSpan={5} className="empty">
													{" "}
													Aucune dépense enregistrée.{" "}
												</td>
											</tr>
										)}
										{depenses.map((d, idx) => (
											<tr key={idx}>
												<td>{new Date(d.date).toLocaleDateString()}</td>
												<td>{d.motif}</td> <td>{d.type}</td>
												<td className="text-right">{formatMoney(d.montant)}</td>
												<td className="text-right">
													<button
														className="icon-btn danger"
														title="Supprimer"
														onClick={() => handleDelete(d)}
													>
														<FaTrash />
													</button>
												</td>
											</tr>
										))}
									</tbody>
									{depenses.length > 0 && (
										<tfoot>
											<tr>
												<td colSpan={3} className="text-right font-semibold">
													{" "}
													Total{" "}
												</td>
												<td className="text-right font-semibold">
													{formatMoney(totalDepenses)} XAF
												</td>
												<td></td>
											</tr>
										</tfoot>
									)}{" "}
								</table>
							</div>
						</div>
					</section>
				)}
				{activeTab === "rapport" && (
					<section className="fade-in">
						<div className="panel">
							<h3 className="panel-title">Rédiger le rapport financier</h3>
							<textarea
								className="textarea"
								rows={6}
								placeholder="Saisissez ici votre rapport"
								value={rapport}
								onChange={(e) => setRapport(e.target.value)}
							/>

							<div className="flex gap-3 mt-3">
								<button className="btn-primary" onClick={handleSendRapport}>
									<FaPaperPlane className="mr-2" />
									Soumettre
								</button>
								<button className="btn-secondary" onClick={exportPDF}>
									<FaDownload className="mr-2" />
									Exporter PDF
								</button>
								{/* <button className="btn-secondary" onClick={openEmailClient}>
									<FaPaperPlane className="mr-2" />
									Envoyer par email
								</button> */}
							</div>
						</div>

						<div className="panel mt-4">
							<h3 className="panel-title">Mes rapports soumis</h3>
							<div className="table-wrap">
								<table className="table">
									<thead>
										<tr>
											<th>Date</th>
											<th>Rapports</th>
											<th>Statuts</th>
										</tr>
									</thead>
									<tbody>
										{rapports.length === 0 && (
											<tr>
												<td colSpan={3} className="empty">
													Aucun rapport soumis.
												</td>
											</tr>
										)}
										{rapports.map((r) => (
											<tr key={r.id}>
												<td>
													{r.createdAt?.toDate().toLocaleDateString() || "—"}
												</td>
												<td>{r.rapport}</td>
												<td>
													<span
														className={`px-2 py-1 rounded text-white text-sm ${
															r.statut === "Valide"
																? "bg-green-500"
																: r.statut === "Refuse"
																? "bg-red-500"
																: "bg-yellow-500"
														}`}
													>
														{r.statut}
													</span>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					</section>
				)}
			</main>
		</div>
	);
}

function Header() {
	const navigate = useNavigate();
	return (
		<div className="flex items-center justify-between mb-6">
			<div>
				<h2 className="text-2xl font-bold">Espace Responsable</h2>
				<p className="text-gray-600 text-sm">
					Gérez votre département et vos dépenses
				</p>
			</div>
			<button
				onClick={() => LogOut(navigate)}
				className="btn-logout hover:bg-red-600 transition-colors duration-300 px-4 py-2 rounded flex items-center"
			>
				<FaSignOutAlt className="mr-2" />
				Déconnexion
			</button>
		</div>
	);
}

function NavItem({ icon, label, active, onClick, expanded }) {
	return (
		<button
			className={`nav-item ${active ? "active" : ""}`}
			onClick={onClick}
			title={label}
		>
			{icon}
			{expanded && <span className="ml-2">{label}</span>}
		</button>
	);
}

function Card({ title, children }) {
	return (
		<div className="card">
			<h4 className="card-title">{title}</h4>
			<div className="card-content">{children}</div>
		</div>
	);
}

function Cards({ children }) {
	return <div className="cards grid md:grid-cols-3 gap-4">{children}</div>;
}

function formatMoney(amount) {
	return amount?.toLocaleString("fr-FR") || "0";
}
