import React, { useState } from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaChartLine,
  FaSearch,
  FaEdit,
} from "react-icons/fa";
import "../Vue/Departement.css"; 

function DepensePage() {
  const [depenses, setDepenses] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    departement: "",
    responsable: "",
    type: "",
    motif: "",
  });
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.departement && form.responsable && form.type && form.motif) {
      if (editIndex !== null) {
        const updatedDepenses = [...depenses];
        updatedDepenses[editIndex] = { ...form };
        setDepenses(updatedDepenses);
        setEditIndex(null);
      } else {
        setDepenses([...depenses, { ...form }]);
      }
      setForm({ departement: "", responsable: "", type: "", motif: "" });
    }
  };

  const editDepense = (index) => {
    setForm({
      departement: depenses[index].departement,
      responsable: depenses[index].responsable,
      type: depenses[index].type,
      motif: depenses[index].motif,
    });
    setEditIndex(index);
  };

  const filteredDepenses = depenses.filter((d) =>
    d.departement.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <main className="main">
        <div className="depense-page">
          <h2>Gestion des Dépenses</h2><br />
          
          <form onSubmit={handleSubmit} className="card">
            <h3>Ajouter une dépense</h3><br />
            <input
              type="text"
              placeholder="Nom du département"
              value={form.departement}
              onChange={(e) => setForm({ ...form, departement: e.target.value })}
            />
            <input
              type="text"
              placeholder="Nom du responsable"
              value={form.responsable}
              onChange={(e) => setForm({ ...form, responsable: e.target.value })}
            />
            <input
              type="text"
              placeholder="Type"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <input
              type="text"
              placeholder="Motif"
              value={form.motif}
              onChange={(e) => setForm({ ...form, motif: e.target.value })}
            />
            <button type="submit" className="btn">Ajouter</button>
          </form><br />

          <div className="search-container">
            <FaSearch className="search-icon" />
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
                  <td>
                    <FaEdit className="icon-edit" onClick={() => editDepense(i)} />
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