import React, { useState } from "react";
import "../Administrateur/Rapport.css";
import {
	FaFileAlt,
	FaUserTie,
	FaPhone,
	FaWallet,
	FaReceipt,
	FaCalendarAlt,
	FaArchive,
	FaCheckCircle,
	FaTimesCircle,
	FaHourglassHalf,
	FaTrashRestore,
	FaTrash,
} from "react-icons/fa";

const initialReports = [
	{
		id: 1,
		responsable: "Alice Dupont",
		téléphone: "+237 673637833",
		budget: 50000,
		depense: 2000,
		motif: "Formation",
		date: "2025-01-15",
		status: "En attente",
	},
	{
		id: 2,
		responsable: "Marc Durand",
		téléphone: "+237 673637834",
		budget: 70000,
		depense: 10000,
		motif: "Serveurs",
		date: "2025-02-05",
		status: "En attente",
	},
	{
		id: 3,
		responsable: "Sophie Martin",
		téléphone: "+237 673637835",
		budget: 40000,
		depense: 8000,
		motif: "Campagne publicitaire",
		date: "2025-02-20",
		status: "Validé",
	},
	{
		id: 4,
		responsable: "Jean Petit",
		téléphone: "+237 673637836",
		budget: 30000,
		depense: 2500,
		motif: "Recrutement",
		date: "2025-03-01",
		status: "Rejeté",
	},
	{
		id: 5,
		responsable: "Paul Lambert",
		téléphone: "+237 673637837",
		budget: 60000,
		depense: 4000,
		motif: "Audit interne",
		date: "2025-01-28",
		status: "Archivé",
	},
	{
		id: 6,
		responsable: "Julie Bernard",
		téléphone: "+237 673637838",
		budget: 80000,
		depense: 12000,
		motif: "Migration vers le cloud",
		date: "2025-02-12",
		status: "En attente",
	},
	{
		id: 7,
		responsable: "Eric Moreau",
		téléphone: "+237 673637839",
		budget: 45000,
		depense: 2000,
		motif: "SEO et référencement",
		date: "2025-03-30",
		status: "Validé",
	},
	{
		id: 8,
		responsable: "Claire Robert",
		téléphone: "+237 673637840",
		budget: 35000,
		depense: 1500,
		motif: "Formation interne",
		date: "2025-04-15",
		status: "Archivé",
	},
	{
		id: 9,
		responsable: "Lucas Fontaine",
		téléphone: "+237 673637841",
		budget: 55000,
		depense: 3000,
		motif: "Conseil en stratégie",
		date: "2025-05-05",
		status: "Rejeté",
	},
	{
		id: 10,
		responsable: "Nathalie Girard",
		téléphone: "+237 673637842",
		budget: 90000,
		depense: 25000,
		motif: "Développement logiciel",
		date: "2025-06-10",
		status: "En attente",
	},
];

function Rapport() {
	const [reports, setReports] = useState(initialReports);
	const [selectedReport, setSelectedReport] = useState(null);
	const [search, setSearch] = useState("");
	const [showTrash, setShowTrash] = useState(false);

	const activeReports = reports.filter((r) => r.status !== "Archivé");
	const archivedReports = reports.filter((r) => r.status === "Archivé");

	const filteredReports = (showTrash ? archivedReports : activeReports).filter(
		(r) =>
			r.responsable.toLowerCase().includes(search.toLowerCase()) ||
			r.motif.toLowerCase().includes(search.toLowerCase())
	);

	const handleArchive = (id) => {
		setReports(
			reports.map((r) => (r.id === id ? { ...r, status: "Archivé" } : r))
		);
		setSelectedReport(null);
	};

	const handleValidate = (id) => {
		setReports(
			reports.map((r) => (r.id === id ? { ...r, status: "Validé" } : r))
		);
		setSelectedReport({ ...selectedReport, status: "Validé" });
	};

	const handleReject = (id) => {
		setReports(
			reports.map((r) => (r.id === id ? { ...r, status: "Rejeté" } : r))
		);
		setSelectedReport({ ...selectedReport, status: "Rejeté" });
	};

	const handleRestore = (id) => {
		setReports(
			reports.map((r) => (r.id === id ? { ...r, status: "En attente" } : r))
		);
		setSelectedReport(null);
	};

	const handleDeleteForever = (id) => {
		setReports(reports.filter((r) => r.id !== id));
		setSelectedReport(null);
	};

	const getStatusBadge = (status) => {
		switch (status) {
			case "Validé":
				return (
					<span style={{ color: "green" }}>
						<FaCheckCircle />
					</span>
				);
			case "Rejeté":
				return (
					<span style={{ color: "red" }}>
						<FaTimesCircle />
					</span>
				);
			case "Archivé":
				return (
					<span style={{ color: "gray" }}>
						<FaArchive />
					</span>
				);
			default:
				return (
					<span style={{ color: "#f29544" }}>
						<FaHourglassHalf />
					</span>
				);
		}
	};

	return (
		<div className="dashboard">
			<main className="main">
				<div style={{ marginBottom: "15px" }}>
					<button
						className="bt"
						style={{
							background: showTrash ? "#0B3D91" : "gray",
							display: "flex",
							alignItems: "center",
							gap: "8px",
						}}
						onClick={() => {
							setShowTrash(!showTrash);
							setSelectedReport(null);
						}}
					>
						{showTrash ? (
							<>
								<FaFileAlt /> Retour aux rapports
							</>
						) : (
							<>
								<FaTrash /> Corbeille ({archivedReports.length})
							</>
						)}
					</button>
				</div>

				<div className="user-list-section">
					<div className="search-container">
						<input
							type="text"
							placeholder={
								showTrash
									? "Rechercher dans la corbeille..."
									: "Rechercher un rapport..."
							}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className="search-bar"
						/>
					</div>
					<div className="user-list">
						{filteredReports.length > 0 ? (
							filteredReports.map((report) => (
								<div
									key={report.id}
									className="user-item"
									onClick={() => setSelectedReport(report)}
								>
									<FaFileAlt style={{ marginRight: "8px" }} />
									{report.responsable} - {getStatusBadge(report.status)}
								</div>
							))
						) : (
							<p style={{ padding: "10px", color: "#777" }}>
								Aucun rapport {showTrash ? "archivé" : ""} trouvé...
							</p>
						)}
					</div>
				</div>

				<div className="profile-section">
					{selectedReport ? (
						<div>
							<h2>
								<FaFileAlt /> Rapport de {selectedReport.responsable}
							</h2>

							<div className="card">
								<h3>
									<FaUserTie /> Responsable
								</h3>
								<p>{selectedReport.responsable}</p>
							</div>
							<div className="card">
								<h3>
									<FaPhone /> Téléphone
								</h3>
								<p>{selectedReport.téléphone}</p>
							</div>
							<div className="card">
								<h3>
									<FaWallet /> Budget alloué
								</h3>
								<p>{selectedReport.budget.toLocaleString()} F</p>
							</div>
							<div className="card">
								<h3>
									<FaReceipt /> Dépense
								</h3>
								<p>{selectedReport.depense.toLocaleString()} F</p>
							</div>
							<div className="card">
								<h3>
									<FaFileAlt /> Motif
								</h3>
								<p>{selectedReport.motif}</p>
							</div>
							<div className="card">
								<h3>
									<FaCalendarAlt /> Date
								</h3>
								<p>{selectedReport.date}</p>
							</div>
							<div className="card">
								<h3>Status du rapport</h3>
								{getStatusBadge(selectedReport.status)}
							</div>

							<div
								style={{
									marginTop: "20px",
									display: "flex",
									gap: "10px",
									flexWrap: "wrap",
								}}
							>
								
								<div className="btn-row" style={{ marginTop: "15px" }}>
									{!showTrash && (
										<>
											<button
												className="btn-small"
												style={{ background: "green" }}
												onClick={() => handleValidate(selectedReport.id)}
												disabled={selectedReport.status === "Validé"}
											>
												<FaCheckCircle /> Valider
											</button>
											<button
												className="btn-small"
												style={{ background: "red" }}
												onClick={() => handleReject(selectedReport.id)}
												disabled={selectedReport.status === "Rejeté"}
											>
												<FaTimesCircle /> Rejeter
											</button>
											<button
												className="btn-small"
												style={{ background: "gray" }}
												onClick={() => handleArchive(selectedReport.id)}
												disabled={selectedReport.status === "Archivé"}
											>
												<FaArchive /> Archiver
											</button>
										</>
									)}

									{showTrash && (
										<>
											<button
												className="btn-small"
												style={{ background: "#2ecc71" }}
												onClick={() => handleRestore(selectedReport.id)}
											>
												<FaTrashRestore /> Restaurer
											</button>
											<button
												className="btn-small"
												style={{ background: "#e74c3c" }}
												onClick={() => handleDeleteForever(selectedReport.id)}
											>
												<FaTrash /> Supprimer
											</button>
										</>
									)}
								</div>
							</div>
						</div>
					) : (
						<div>
							<h2>
								<FaFileAlt /> Sélectionnez un rapport
							</h2>
							<p>Les détails apparaîtront ici.</p>
						</div>
					)}
				</div>
			</main>
		</div>
	);
}

export default Rapport;
