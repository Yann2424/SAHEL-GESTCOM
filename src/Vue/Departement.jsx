import React, { useState, useEffect } from "react";
import "../Vue/Departement.css";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaChartLine,
  FaSearch,
  FaToggleOn,
  FaToggleOff,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { NewDepartement, GetDepartement, UpdateDepartement, DeleteDepartement } from '../Modules/Departement/Departement_firebase.jsx'; // Ajustez le chemin vers votre fichier

function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", manager: "" });
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(true); // Pour gérer l'état de chargement

  useEffect(() => {
    const fetchDepartments = async () => {
      const data = await GetDepartement();
      if (Array.isArray(data)) {
        setDepartments(data);
      } else {
        console.error("Données reçues non valides :", data);
        setDepartments([]); // Assurez-vous que departments est un tableau
      }
      setLoading(false); // Fin du chargement
    };
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  const departmentExists = departments.some(d => d.name === form.name);

  if (departmentExists) {
    alert("Un département avec ce nom existe déjà."); 
    return;
  }

  if (form.name && form.manager) {
    if (editIndex !== null) {
      const updatedData = { ...form, active: departments[editIndex].active };
      await UpdateDepartement(departments[editIndex], updatedData, form.name);
      const updatedDepartments = [...departments];
      updatedDepartments[editIndex] = updatedData;
      setDepartments(updatedDepartments);
      setEditIndex(null);
    } else {
      await NewDepartement({ ...form, active: true });
      setDepartments([...departments, { ...form, active: true }]);
    }
    setForm({ name: "", manager: "" });
  }
};

  const deleteDepartment = async (index) => {
    await DeleteDepartement(departments[index]);
    setDepartments(departments.filter((_, i) => i !== index));
  };

  const editDepartment = (index) => {
    setForm({ name: departments[index].name, manager: departments[index].manager });
    setEditIndex(index);
  };

  const toggleActive = (index) => {
    const updated = [...departments];
    updated[index].active = !updated[index].active; // Toggle the active status
    setDepartments(updated);
  };

  const filteredDepartments = Array.isArray(departments) ? departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  ) : [];

  if (loading) {
    return <div>Chargement...</div>; // État de chargement
  }

  return (
    <div className="dashboard">
      <main className="main">
        <div className="departments-page">
          <h2>Gestion des départements</h2><br />
          <form onSubmit={handleSubmit} className="card">
            <h3>Ajouter un département</h3><br />
            <input
              type="text"
              placeholder="Nom du département"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nom du responsable"
              value={form.manager}
              onChange={(e) => setForm({ ...form, manager: e.target.value })}
            />
            <button type="submit" className="btn">Ajouter</button>
          </form><br />
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher un département..."
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
                <th>Statut</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredDepartments.map((d, i) => (
                <tr key={i}>
                  <td>{d.name}</td>
                  <td>{d.manager}</td>
                  <td>
                    {d.active ? (
                      <FaToggleOn className="icon-active" onClick={() => toggleActive(i)} />
                    ) : (
                      <FaToggleOff className="icon-inactive" onClick={() => toggleActive(i)} />
                    )}
                  </td>
                  <td>
                    <FaEdit className="icon-edit" onClick={() => editDepartment(i)} /><br />
                    <FaTrash className="icon-delete" onClick={() => deleteDepartment(i)} />
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

export default DepartmentsPage;