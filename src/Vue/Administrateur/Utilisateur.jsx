import React, { useState, useEffect } from "react";
import "../Administrateur/Utilisateur.css";
import {
  FaUserCircle,
  FaEnvelope,
  FaFolderOpen,
  FaReceipt,
} from "react-icons/fa";
import { NewUser, GetUser, UpdateUser } from "../../Modules/User/User_firebase";
import { GetDepenseFUser } from "../../Modules/UtilisateurR/Depense/DepenseRes"; //on importe ta fonction

function Utilisateur() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [userExpenses, setUserExpenses] = useState([]); // Dépenses de l’utilisateur sélectionné

  const departmentList = [
    "Finance",
    "Ressources Humaines",
    "Informatique",
    "Marketing",
    "Ventes",
    "Logistique",
    "Administration",
  ];

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    téléphone: "",
    department: "",
    role: "",
  });
  const [showForm, setShowForm] = useState(false);

  // Charger tous les utilisateurs
  useEffect(() => {
    async function fetchUsers() {
      const data = await GetUser();
      setUsers(data);
    }
    fetchUsers();
  }, []);

  // Extraire tous les départements à partir des utilisateurs
  useEffect(() => {
    const deps = [...new Set(users.map((u) => u.department).filter(Boolean))];
    setDepartments(deps);
  }, [users]);

  // Charger les dépenses du user sélectionné (via ta fonction)
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

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      (user.department &&
        user.department.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddUser = async (e) => {
    e.preventDefault();
    if (newUser.name && newUser.email && newUser.department && newUser.role) {
      await NewUser(newUser);
      setUsers([...users, newUser]);
      setNewUser({
        name: "",
        email: "",
        téléphone: "",
        department: "",
        role: "",
      });
      setShowForm(false);
    }
  };

  const HandleUpdateUser = async (updatedUser) => {
    if (!selectedUser) return;
    await UpdateUser(selectedUser, updatedUser);
    const updatedUsers = users.map((u) =>
      u.email === selectedUser.email ? updatedUser : u
    );
    setUsers(updatedUsers);
    setSelectedUser(updatedUser);
  };

  // Total des dépenses d’un utilisateur
  const totalExpenses = userExpenses.reduce(
    (sum, e) => sum + (e.montant || 0),
    0
  );

  return (
    <div className="dashboard">
      <main className="main">
        <div className="user-list-section">
          <div className="add-user-section">
            <button onClick={() => setShowForm(!showForm)}>
              {showForm ? "Annuler" : "Ajouter un utilisateur"}
            </button>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar"
            />
          </div>

          <div className="user-list">
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
                    [{user.role}]
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="profile-section">
          {selectedUser ? (
            <div>
              <h2>
                <FaUserCircle /> {selectedUser.name}
              </h2>
              <div className="card">
                <h3>
                  <FaEnvelope /> Informations personnelles
                </h3>
                <p>Email : {selectedUser.email}</p>
                <p>Téléphone : {selectedUser.téléphone}</p>
                <p>Rôle : {selectedUser.role || "Utilisateur"}</p>
              </div>
              <div className="card">
                <h3>
                  <FaFolderOpen /> Département
                </h3>
                <p>{selectedUser.department}</p>
              </div>
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
                    <p
                      style={{
                        marginTop: "10px",
                        fontWeight: "bold",
                        color: "#e74c3c",
                      }}
                    >
                      Total : {totalExpenses.toLocaleString()} F
                    </p>
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

        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <button
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                &times;
              </button>
              <form onSubmit={handleAddUser}>
                <input
                  type="text"
                  placeholder="Nom"
                  value={newUser.name}
                  onChange={(e) =>
                    setNewUser({ ...newUser, name: e.target.value })
                  }
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  required
                />
                <input
                  type="text"
                  placeholder="Téléphone"
                  value={newUser.téléphone}
                  onChange={(e) =>
                    setNewUser({ ...newUser, téléphone: e.target.value })
                  }
                />

                {/* Select des départements fixe */}
                <select
                  value={newUser.department}
                  onChange={(e) =>
                    setNewUser({ ...newUser, department: e.target.value })
                  }
                  required
                >
                  <option value="">Sélectionnez un département</option>
                  {departmentList.map((dep, i) => (
                    <option key={i} value={dep}>
                      {dep}
                    </option>
                  ))}
                </select>

                {/* Select du rôle */}
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  required
                >
                  <option value="">Sélectionnez un rôle</option>
                  <option value="responsable">Responsable</option>
                  <option value="utilisateur">Utilisateur</option>
                </select>

                <button type="submit" className="bt">
                  Enregistrer
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Utilisateur;
