import React, { useState, useEffect } from "react";
import "../Administrateur/Departement.css"; 
import { FaEdit } from "react-icons/fa";
import { NewBudget, GetBudget, UpdatedBudget } from "../../Modules/Budget/Budget_firebase";

function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ departement: "", responsable: "", montant: "", date: "" });
  const [editIndex, setEditIndex] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      const data = await GetBudget();
      setBudgets(data);
    };
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.departement || !form.responsable || !form.montant || !form.date) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    if (editIndex !== null) {
      const oldBudget = budgets[editIndex];
      await UpdatedBudget(oldBudget, form, `${form.responsable}_${form.departement}`);

      const updatedBudgets = [...budgets];
      updatedBudgets[editIndex] = form;
      setBudgets(updatedBudgets);

      setEditIndex(null);
    } else {
      await NewBudget(form);

      setBudgets([...budgets, form]);
    }

    setForm({ departement: "", responsable: "", montant: "", date: "" });
  };

  const editBudget = (index) => {
    setForm(budgets[index]);
    setEditIndex(index);
  };

  const filteredBudgets = budgets.filter((b) =>
    b.departement?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <main className="main">
        <div className="budget-page">
          <h2>Gestion des budgets</h2><br />
          
          <form onSubmit={handleSubmit} className="card">
            <h3>{editIndex !== null ? "Modifier un budget" : "Ajouter un budget"}</h3><br />
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
              type="number"
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
            <button type="submit" className="btn">
              {editIndex !== null ? "Modifier" : "Ajouter"}
            </button>
          </form><br />

          <div className="search-container">
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
                  <td>{b.montant} F</td>
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
