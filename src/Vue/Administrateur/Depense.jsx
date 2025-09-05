import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import "./Departement.css";
import { NewDepense, GetDepense, UpdateDepense, DeleteDepense } from "../../Modules/Depense/Depense_firebase"; 
import { GetUser } from "../../Modules/User/User_firebase"; // pour récupérer les utilisateurs

function DepensePage() {
  const [depenses, setDepenses] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    departement: "",
    responsable: "",
    type: "",
    motif: "",
    montant: "",
  });
  const [editId, setEditId] = useState(null);

  // Charger les dépenses
  useEffect(() => {
    async function fetchDepenses() {
      const data = await GetDepense();
      setDepenses(data);
    }
    fetchDepenses();
  }, []);

  // Charger les utilisateurs
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await GetUser();
      if (Array.isArray(data)) setUsers(data);
      else setUsers([]);
    };
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.departement && form.responsable && form.type && form.motif && form.montant) {
      if (editId) {
        await UpdateDepense(editId, { ...form, montant: Number(form.montant) });
        const updatedDepenses = depenses.map((d) =>
          d.id === editId ? { ...d, ...form, montant: Number(form.montant) } : d
        );
        setDepenses(updatedDepenses);
        setEditId(null);
      } else {
        const newDep = { ...form, montant: Number(form.montant) };
        await NewDepense(newDep);
        setDepenses([...depenses, newDep]);
      }
      setForm({ departement: "", responsable: "", type: "", motif: "", montant: "" });
    }
  };

  const editDepense = (dep) => {
    setForm(dep);
    setEditId(dep.id);
  };

  const deleteDepense = async (dep) => {
    await DeleteDepense(dep.id);
    setDepenses(depenses.filter((d) => d.id !== dep.id));
  };

  const filteredDepenses = depenses.filter((d) =>
    (d.departement || '').toLowerCase().includes(search.toLowerCase())
  );

  // Filtrer les utilisateurs selon le département saisi
  const filteredUsersByDept = users.filter(
    (u) => (u.department || "").toLowerCase() === form.departement.toLowerCase()
  );

  return (
    <div className="dashboard">
      <main className="main">
        <div className="depense-page">

          <form onSubmit={handleSubmit} className="card">
            <h3>{editId ? "Modifier une dépense" : "Ajouter une dépense"}</h3>
            <br />

            {/* Input département */}
            <input
              type="text"
              placeholder="Nom du département"
              value={form.departement}
              onChange={(e) => setForm({ ...form, departement: e.target.value, responsable: "" })}
              required
            />

            {/* Select responsable filtré par département */}
            <select
              value={form.responsable}
              onChange={(e) => setForm({ ...form, responsable: e.target.value })}
              required
              disabled={!form.departement}
            >
              <option value="">
                {form.departement
                  ? "Sélectionnez le responsable"
                  : "Saisissez un département d'abord"}
              </option>
              {filteredUsersByDept.map((user, i) => (
                <option key={i} value={user.name}>
                  {user.name} ({user.role || "Utilisateur"})
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Motif"
              value={form.motif}
              onChange={(e) => setForm({ ...form, motif: e.target.value })}
              required
            />
            <input
              type="number"
              placeholder="Montant"
              value={form.montant}
              onChange={(e) => setForm({ ...form, montant: e.target.value })}
              required
            />
            <button type="submit" className="btn">
              {editId ? "Modifier" : "Ajouter"}
            </button>
          </form>
          <br />

          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher une dépense..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-bar"
            />
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Nom du département</th>
                <th>Responsable</th>
                <th>Type</th>
                <th>Motif</th>
                <th>Montant</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepenses.map((d, i) => (
                <tr key={i}>
                  <td>{d.departement}</td>
                  <td>{d.responsable}</td>
                  <td>{d.type}</td>
                  <td>{d.motif}</td>
                  <td>{Number(d.montant).toLocaleString()} F</td>
                  <td>
                    <FaEdit className="icon-edit" onClick={() => editDepense(d)} />
                    <FaTrash
                      className="icon-delete"
                      onClick={() => deleteDepense(d)}
                      style={{ marginLeft: "8px", color: "red", cursor: "pointer" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default DepensePage;
