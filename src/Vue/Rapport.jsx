import React, { useState } from "react";
import "../Vue/Utilisateur.css"; // On réutilise ton CSS Utilisateur
import {
  FaFileAlt,
  FaUserTie,
  FaPhone,
  FaWallet,
  FaReceipt,
  FaCalendarAlt,
  FaArchive,
} from "react-icons/fa";

// Liste des rapports fictifs
const initialReports = [
  {
    id: 1,
    responsable: "Alice Dupont",
    téléphone: "+237 673637833",
    budget: 50000,
    depense: 2000,
    motif: "Formation",
    date: "2025-01-15",
  },
  {
    id: 2,
    responsable: "Marc Durand",
    téléphone: "+237 673637834",
    budget: 70000,
    depense: 10000,
    motif: "Serveurs",
    date: "2025-02-05",
  },
  {
    id: 3,
    responsable: "Sophie Martin",
    téléphone: "+237 673637835",
    budget: 40000,
    depense: 8000,
    motif: "Campagne pub",
    date: "2025-02-20",
  },
  {
    id: 4,
    responsable: "Jean Petit",
    téléphone: "+237 673637836",
    budget: 30000,
    depense: 2500,
    motif: "Recrutement",
    date: "2025-03-01",
  },
  {
    id: 5,
    responsable: "Paul Lambert",
    téléphone: "+237 673637837",
    budget: 60000,
    depense: 4000,
    motif: "Audit",
    date: "2025-01-28",
  },
  {
    id: 6,
    responsable: "Julie Bernard",
    téléphone: "+237 673637838",
    budget: 80000,
    depense: 12000,
    motif: "Cloud",
    date: "2025-02-12",
  },
  {
    id: 7,
    responsable: "Eric Moreau",
    téléphone: "+237 673637839",
    budget: 45000,
    depense: 2000,
    motif: "SEO",
    date: "2025-03-30",
  },
  {
    id: 8,
    responsable: "Claire Robert",
    téléphone: "+237 673637840",
    budget: 35000,
    depense: 1500,
    motif: "Formation interne",
    date: "2025-04-15",
  },
  {
    id: 9,
    responsable: "Lucas Fontaine",
    téléphone: "+237 673637841",
    budget: 55000,
    depense: 3000,
    motif: "Conseil",
    date: "2025-05-05",
  },
];

function Rapport() {
  const [reports, setReports] = useState(initialReports);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");

  // 🔎 Filtrage des rapports sur la base du nom du responsable ou du motif
  const filteredReports = reports.filter(
    (r) =>
      r.responsable.toLowerCase().includes(search.toLowerCase()) ||
      r.motif.toLowerCase().includes(search.toLowerCase())
  );

  const handleArchive = (id) => {
    setReports(reports.filter((r) => r.id !== id));
    setSelectedReport(null);
  };

  return (
    <div className="dashboard">
      <main className="main">
        {/* SECTION LISTE DES RAPPORTS */}
        <div className="user-list-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un rapport..."
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
                  Rapport - {report.responsable}
                </div>
              ))
            ) : (
              <p style={{ padding: "10px", color: "#777" }}>
                Aucun rapport trouvé...
              </p>
            )}
          </div>
        </div>

        {/* SECTION DÉTAIL RAPPORT */}
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

              <button
                className="bt"
                style={{ background: "#e63946", marginTop: "15px" }}
                onClick={() => handleArchive(selectedReport.id)}
              >
                <FaArchive /> Archiver ce rapport
              </button>
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