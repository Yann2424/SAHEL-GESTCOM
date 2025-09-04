import React, { useEffect, useState } from "react";
import "./Rapport.css";
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

// 🔹 Import des fonctions Firebase
import {
  GetRapports,
  ValideRapport,
  refuserRapport,
} from "../../Modules/UtilisateurR/Rapport/RapportR";

function Rapport() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [search, setSearch] = useState("");
  const [showTrash, setShowTrash] = useState(false);

  // --- Charger les rapports depuis Firebase ---
  useEffect(() => {
    const fetchData = async () => {
      const data = await GetRapports();
      setReports(data || []);
    };
    fetchData();
  }, []);

  const activeReports = reports.filter((r) => r.statut !== "Archivé");
  const archivedReports = reports.filter((r) => r.statut === "Archivé");

  const filteredReports = (showTrash ? archivedReports : activeReports).filter(
    (r) =>
      (r.rapport && r.rapport.toLowerCase().includes(search.toLowerCase())) ||
      (r.email && r.email.toLowerCase().includes(search.toLowerCase()))
  );

  // --- Actions ---
  const handleValidate = async (report) => {
    await ValideRapport({ email: report.email }, report.id);
    setReports(
      reports.map((r) =>
        r.id === report.id ? { ...r, statut: "Valide" } : r
      )
    );
    setSelectedReport({ ...report, statut: "Valide" });
  };

  const handleReject = async (report) => {
    await refuserRapport({ email: report.email }, report.id);
    setReports(
      reports.map((r) =>
        r.id === report.id ? { ...r, statut: "Refuse" } : r
      )
    );
    setSelectedReport({ ...report, statut: "Refuse" });
  };

  const handleArchive = (id) => {
    setReports(
      reports.map((r) => (r.id === id ? { ...r, statut: "Archivé" } : r))
    );
    setSelectedReport(null);
  };

  const handleRestore = (id) => {
    setReports(
      reports.map((r) => (r.id === id ? { ...r, statut: "en attente" } : r))
    );
    setSelectedReport(null);
  };

  const handleDeleteForever = (id) => {
    setReports(reports.filter((r) => r.id !== id));
    setSelectedReport(null);
  };

  // --- Badges statut ---
  const getStatusBadge = (status) => {
    switch (status) {
      case "Valide":
        return (
          <span style={{ color: "green" }}>
            <FaCheckCircle />
          </span>
        );
      case "Refuse":
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
        {/* Bouton bascule corbeille */}
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

        {/* Liste des rapports */}
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
                  {report.email || "Utilisateur"} -{" "}
                  {getStatusBadge(report.statut)}
                </div>
              ))
            ) : (
              <p style={{ padding: "10px", color: "#777" }}>
                Aucun rapport {showTrash ? "archivé" : ""} trouvé...
              </p>
            )}
          </div>
        </div>

        {/* Détails du rapport sélectionné */}
        <div className="profile-section">
          {selectedReport ? (
            <div>
              <h2>
                <FaFileAlt /> Rapport de {selectedReport.email}
              </h2>

              <div className="card">
                <h3>
                  <FaFileAlt /> Contenu
                </h3>
                <p>{selectedReport.rapport}</p>
              </div>
              <div className="card">
                <h3>
                  <FaCalendarAlt /> Date
                </h3>
                <p>
                  {selectedReport.createdAt
                    ? new Date(
                        selectedReport.createdAt.seconds * 1000
                      ).toLocaleDateString()
                    : "—"}
                </p>
              </div>
              <div className="card">
                <h3>Status du rapport</h3>
                {getStatusBadge(selectedReport.statut)}
              </div>

              <div
                style={{
                  marginTop: "20px",
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                {!showTrash && (
                  <>
                    <button
                      className="btn-small"
                      style={{ background: "green" }}
                      onClick={() => handleValidate(selectedReport)}
                      disabled={selectedReport.statut === "Valide"}
                    >
                      <FaCheckCircle /> Valider
                    </button>
                    <button
                      className="btn-small"
                      style={{ background: "red" }}
                      onClick={() => handleReject(selectedReport)}
                      disabled={selectedReport.statut === "Refuse"}
                    >
                      <FaTimesCircle /> Rejeter
                    </button>
                    <button
                      className="btn-small"
                      style={{ background: "gray" }}
                      onClick={() => handleArchive(selectedReport.id)}
                      disabled={selectedReport.statut === "Archivé"}
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
                      onClick={() =>
                        handleDeleteForever(selectedReport.id)
                      }
                    >
                      <FaTrash /> Supprimer
                    </button>
                  </>
                )}
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
