import React, { useEffect, useMemo, useState } from "react";
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
import "../Responsable/DashbordResponsable.css";

const RESPONSABLE_NAME = "Responsable: Jean Dupont";
const ASSIGNED_DEPARTMENT = "Informatique";
const ASSIGNED_BUDGET = 2_500_000;

export default function DashboardResponsable() {
	const [activeTab, setActiveTab] = useState("departement");
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const [depenseForm, setDepenseForm] = useState({
		montant: "",
		date: "",
		motif: "",
		type: "",
	});

	const [depenses, setDepenses] = useState(() => {
		const cached = localStorage.getItem("depenses");
		return cached ? JSON.parse(cached) : [];
	});

	const [rapport, setRapport] = useState(
		() => localStorage.getItem("rapport") || ""
	);
	const [adminEmail, setAdminEmail] = useState("admin@entreprise.com");

	useEffect(() => {
		localStorage.setItem("depenses", JSON.stringify(depenses));
	}, [depenses]);

	useEffect(() => {
		localStorage.setItem("rapport", rapport);
	}, [rapport]);

	const totalDepenses = useMemo(
		() => depenses.reduce((sum, d) => sum + Number(d.montant || 0), 0),
		[depenses]
	);
	const resteBudget = Math.max(ASSIGNED_BUDGET - totalDepenses, 0);
	const progressPct = Math.min((totalDepenses / ASSIGNED_BUDGET) * 100, 100);

	function handleAddDepense(e) {
		e.preventDefault();
		const { montant, date, motif } = depenseForm;
		if (!montant || !date || !motif)
			return alert("Veuillez remplir tous les champs.");
		if (Number(montant) <= 0)
			return alert("Le montant doit être supérieur à 0.");
		const item = {
			id: crypto.randomUUID(),
			montant: Number(montant),
			date,
			motif,
			type: depenseForm.type,
		};
		setDepenses((prev) => [item, ...prev]);
		setDepenseForm({ montant: "", date: "", motif: "" });
	}

	function handleDelete(id) {
		setDepenses((prev) => prev.filter((d) => d.id !== id));
	}

	function exportPDF() {
		const doc = new jsPDF({ unit: "pt", format: "a4" });

		const title = `Rapport financier – Département ${ASSIGNED_DEPARTMENT}`;
		const dateStr = new Date().toLocaleDateString();

		doc.setFontSize(18);
		doc.text(title, 40, 40);
		doc.setFontSize(11);
		doc.text(`${RESPONSABLE_NAME} | Date: ${dateStr}`, 40, 62);
		doc.text(`Budget attribué: ${formatMoney(ASSIGNED_BUDGET)} XAF`, 40, 80);
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

		// Rapport texte
		const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 150;
		doc.setFontSize(13);
		doc.text("Rapport du responsable:", 40, finalY);
		doc.setFontSize(11);

		// Découper le texte du rapport en lignes qui tiennent dans la page
		const lines = doc.splitTextToSize(rapport || "(Aucun rapport saisi)", 515);
		doc.text(lines, 40, finalY + 18);

		doc.save(
			`Rapport_${ASSIGNED_DEPARTMENT}_${dateStr.replaceAll("/", "-")}.pdf`
		);
	}

	function openEmailClient() {
		const subject = encodeURIComponent(
			`Rapport financier – ${ASSIGNED_DEPARTMENT}`
		);
		const body = encodeURIComponent(
			`Bonjour,\n\nVeuillez trouver ci-joint le rapport financier.\n\nRésumé:\n- Budget: ${formatMoney(
				ASSIGNED_BUDGET
			)} XAF\n- Dépenses: ${formatMoney(
				totalDepenses
			)} XAF\n- Reste: ${formatMoney(
				resteBudget
			)} XAF\n\n${rapport}\n\nCordialement,\n${RESPONSABLE_NAME}`
		);
		window.location.href = `mailto:${adminEmail}?subject=${subject}&body=${body}`;
	}

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
						icon={<FaSitemap />}
						label="Département"
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

				{activeTab === "departement" && (
					<section className="fade-in">
						<Cards>
							<Card title="Département assigné">
								<div className="text-2xl font-semibold">
									{ASSIGNED_DEPARTMENT}
								</div>
							</Card>
							<Card title="Responsable">
								<div className="text-2xl font-semibold">{RESPONSABLE_NAME}</div>
							</Card>
						</Cards>

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
									{formatMoney(ASSIGNED_BUDGET)}{" "}
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
						{/* Formulaire d'ajout de dépense */}
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
										<option value="Autre">Autre</option>
									</select>
								</div>

								<div className="md:col-span-12 flex items-end">
									<button type="submit" className="btn-primary">
										<FaPlus className="mr-2" /> Ajouter
									</button>
								</div>
							</form>
						</div>

						{/* Tableau des dépenses */}
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
											<th></th>
										</tr>
									</thead>
									<tbody>
										{depenses.length === 0 && (
											<tr>
												<td colSpan={5} className="empty">
													Aucune dépense enregistrée.
												</td>
											</tr>
										)}
										{depenses.map((d) => (
											<tr key={d.id}>
												<td>{new Date(d.date).toLocaleDateString()}</td>
												<td>{d.motif}</td>
												<td>{d.type}</td>
												<td className="text-right">{formatMoney(d.montant)}</td>
												<td className="text-right">
													<button
														className="icon-btn danger"
														title="Supprimer"
														onClick={() => handleDelete(d.id)}
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
													Total
												</td>
												<td className="text-right font-semibold">
													{formatMoney(totalDepenses)} XAF
												</td>
												<td></td>
											</tr>
										</tfoot>
									)}
								</table>
							</div>
						</div>

						{/* Barre de progression du budget */}
						<div className="panel mt-4">
							<h3 className="panel-title">Consommation du budget</h3>
							<div className="progress">
								<div
									className="progress-bar"
									style={{
										width: `${progressPct}%`,
										backgroundColor:
											progressPct > 80
												? "#ef4444" 
												: progressPct > 50
												? "#facc15" 
												: "#f97316", 
									}}
								/>
							</div>

							<div className="mt-2 text-sm text-gray-600">
								{((totalDepenses / ASSIGNED_BUDGET) * 100).toFixed(1)}% consommé
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
								rows={10}
								placeholder="Saisissez ici votre rapport (objectifs, dépenses majeures, écarts, recommandations, etc.)."
								value={rapport}
								onChange={(e) => setRapport(e.target.value)}
							/>

							<div className="grid md:grid-cols-2 gap-3 mt-3">
								<div>
									<label className="label">Email de l'administrateur</label>
									<input
										className="input"
										type="email"
										value={adminEmail}
										onChange={(e) => setAdminEmail(e.target.value)}
									/>
									<p className="help">
										Le bouton Envoyer ouvrira votre messagerie avec un email
										prérempli. Joignez le PDF exporté.
									</p>
								</div>
								<div className="flex items-end gap-2">
									<button className="btn-secondary" onClick={exportPDF}>
										<FaDownload className="mr-2" />
										Exporter en PDF
									</button>
									<button className="btn-primary" onClick={openEmailClient}>
										<FaPaperPlane className="mr-2" />
										Envoyer
									</button>
								</div>
							</div>
						</div>
					</section>
				)}
			</main>

			{/* Styles locaux
      <style>{css}</style> */}
		</div>
	);
}

function Header() {
	return (
		<div className="flex items-center justify-between mb-6">
			<div>
				<h2 className="text-2xl font-bold">Espace Responsable</h2>
				<p className="text-gray-600 text-sm">
					Gérez votre département, suivez le budget, enregistrez les dépenses et
					rédigez vos rapports.
				</p>
			</div>
			<button className="btn-ghost">
				<FaSignOutAlt className="mr-2" />
				Déconnexion
			</button>
		</div>
	);
}

function NavItem({ icon, label, active, onClick, expanded }) {
	return (
		<button className={`nav-item ${active ? "active" : ""}`} onClick={onClick}>
			<span className="nav-icon">{icon}</span>
			<span
				className={`nav-label ${
					expanded ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
			>
				{label}
			</span>
		</button>
	);
}

function Cards({ children }) {
	return (
		<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
			{children}
		</div>
	);
}

function Card({ title, subtitle, children }) {
	return (
		<div className="card">
			<div className="card-head">
				<h4 className="card-title">{title}</h4>
				{subtitle && <span className="card-subtitle">{subtitle}</span>}
			</div>
			<div className="card-body">{children}</div>
		</div>
	);
}

function formatMoney(n) {
	try {
		return new Intl.NumberFormat("fr-FR").format(Number(n));
	} catch {
		return `${n}`;
	}
}
