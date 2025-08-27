import React, { useState } from "react";
import "../Vue/Departement.css"; 
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaMoneyBillWave,
  FaChartLine,
  FaSearch,
  FaEdit,
} from "react-icons/fa";

function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ departement: "", responsable: "", montant: "", date: "" });
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = (e) => {
  e.preventDefault();
  const budgetExists = budgets.some(b => b.departement === form.departement);

  if (budgetExists) {
    alert("Un budget pour ce département existe déjà."); 
    return;
  }

  if (form.departement && form.responsable && form.montant && form.date) {
    if (editIndex !== null) {
      const updatedBudgets = [...budgets];
      updatedBudgets[editIndex] = { ...form };
      setBudgets(updatedBudgets);
      setEditIndex(null);
    } else {
      setBudgets([...budgets, { ...form }]);
    }
    setForm({ departement: "", responsable: "", montant: "", date: "" });
  }
};

  const editBudget = (index) => {
    setForm({ departement: budgets[index].departement, responsable: budgets[index].responsable, montant: budgets[index].montant, date: budgets[index].date });
    setEditIndex(index);
  };

  const filteredBudgets = budgets.filter((b) =>
    b.departement.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <main className="main">
        <div className="budget-page">
          <h2>Gestion des budgets</h2><br />
          
          <form onSubmit={handleSubmit} className="card">
            <h3>Ajouter un budget</h3><br />
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
              placeholder="Montant"
              value={form.montant}
              onChange={(e) => setForm({ ...form, montant: e.target.value })}
            />
            <input
              type="date"
              placeholder="Date d'ajout"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
            <button type="submit" className="btn">Ajouter</button>
          </form><br />

          <div className="search-container">
            {/* <FaSearch className="search-icon" /> */}
            <input
              type="text"
              placeholder="Rechercher un budget..."
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
                <th>Montant</th>
                <th>Date d'ajout</th>
                <th>Options</th>
              </tr>
            </thead>
            <tbody>
              {filteredBudgets.map((b, i) => (
                <tr key={i}>
                  <td>{b.departement}</td>
                  <td>{b.responsable}</td>
                  <td>{b.montant}</td>
                  <td>{b.date}</td>
                  <td>
                    <FaEdit className="icon-edit" onClick={() => editBudget(i)} />
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

export default BudgetPage;