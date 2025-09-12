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
  FaUserCircle,
} from "react-icons/fa";

// 🔹 Import des fonctions Firebase
import {
  GetRapports,
  ValideRapport,
  refuserRapport,
} from "../../Modules/UtilisateurR/Rapport/RapportR";
import { GetUser, GetUsers } from "../../Modules/User/User_firebase";
import { GetDepenseFUser } from "../../Modules/UtilisateurR/Depense/DepenseRes";

function Rapport() {
  const [userExpenses, setUserExpenses] = useState([])
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [search, setSearch] = useState("");


  useEffect(() => {
      async function fetchUsers() {
        const data = await GetUser();
        setUsers(data);
      }
      fetchUsers();
    }, []);

  useEffect(() => {
    async function fetchExpenses() {
      if (selectedUser && selectedUser.email) {
        const res = await GetDepenseFUser({ email: selectedUser.email });
        if (res && res.expenses) {
          setUserExpenses(res.expenses);
        } else {
          setUserExpenses([]);
        }
      }
    }
    fetchExpenses();
  }, [selectedUser]);

  // const totalExpenses = userExpenses.reduce(
  //   (sum, e) => sum + (e.montant || 0),
  //   0
  // );

  const filteredUsers = users.filter(
    (user) =>
      (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.department &&
        user.department.toLowerCase().includes(search.toLowerCase()))
  );

  // Grouper les dépenses par mois
const expensesByMonth = userExpenses.reduce((acc, expense) => {
  if (!expense.date) return acc;

  // Extraire l'année et le mois (format YYYY-MM)
  const date = new Date(expense.date);
  const monthKey = `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}`;

  if (!acc[monthKey]) acc[monthKey] = 0;
  acc[monthKey] += expense.montant || 0;

  return acc;
}, {});

  const expensesByMonthArray = Object.entries(expensesByMonth).map(
  ([month, total]) => ({
    month,
    total
  })
);

// Optionnel : trier du plus récent au plus ancien
expensesByMonthArray.sort((a, b) => new Date(b.month + "-01") - new Date(a.month + "-01"));


  return (
    <div className="dashboard">
          <main className="main">
            <div className="user-list-section">
              
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="search-bar"
                />
              </div>
    
              
                {filteredUsers.map((user, index) => (
                  <div
                    key={index}
                    className="user-item"
                    onClick={() => setSelectedUser(user)}
                  >
                    <FaUserCircle style={{ marginRight: "8px" }} />
                    {user.name}{" "}
                    {user.department && (
                      <span style={{ color: "#555", fontSize: "0.9rem" }}>
                        ({user.department})
                      </span>
                    )}
                    {user.role && (
                      <span
                        style={{
                          color: "#0b3d91",
                          fontSize: "0.85rem",
                          marginLeft: "5px",
                        }}
                      >
                        {/* [{user.role}] */}
                      </span>
                    )}
                  </div>
                ))}
              
            </div>
    
            <div className="profile-section">
              {selectedUser ? (
                <div>
                  <h2>
                    <FaUserCircle /> {selectedUser.name}
                  </h2>
                  
                  <div className="card">
                    <h3>
                      <FaReceipt /> Dépenses effectuées
                    </h3>
                    {userExpenses.length > 0 ? (
                      <>
                        <ul>
                          {userExpenses.map((e, i) => (
                            <li key={i}>
                              {e.motif} - {e.date} :{" "}
                              {e.montant.toLocaleString()} F
                            </li>
                          ))}
                        </ul>
                        <ul>
                          {expensesByMonthArray.map((e, i) => (
                            <li key={i}>
                              {e.month} : {e.total.toLocaleString()} F
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <p>Aucune dépense enregistrée pour cet utilisateur.</p>
                    )}

                  </div>
                </div>
              ) : (
                <div>
                  <h2>
                    <FaUserCircle /> Sélectionnez un utilisateur
                  </h2>
                  <p>Les informations apparaîtront ici.</p>
                </div>
              )}
            </div>
    
            
          </main>
        </div>
      );
    }


export default Rapport

{/* <ul>
                          {userExpenses.map((e, i) => (
                            <li key={i}>
                              {e.motif} - {e.date} :{" "}
                              {e.montant.toLocaleString()} F
                            </li>
                          ))}
                        </ul> */}
                        // <p
                        //   style={{
                        //     marginTop: "10px",
                        //     fontWeight: "bold",
                        //     color: "#e74c3c",
                        //   }}
                        // >
                        //   Total : {totalExpenses.toLocaleString()} F
                        // </p>
                        