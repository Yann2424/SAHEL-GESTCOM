import React, { useState, useEffect } from "react";
import "./Departement.css"; 
import { FaEdit } from "react-icons/fa";
import { NewBudget, GetBudget, UpdatedBudget } from "../../Modules/Budget/Budget_firebase";
import { GetUser } from "../../Modules/User/User_firebase";

function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    departement: "",
    responsable: "",
    montant: "",
    date: "",
    description: ""
  });
  const [editIndex, setEditIndex] = useState(null);

  // Charger les budgets
  useEffect(() => {
    const fetchBudgets = async () => {
      const data = await GetBudget();
      setBudgets(data);
    };
    fetchBudgets();
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

    setForm({ departement: "", responsable: "", montant: "", date: "", description: "" });
  };

  const editBudget = (index) => {
    setForm(budgets[index]);
    setEditIndex(index);
  };

  const filteredBudgets = budgets.filter((b) =>
    b.departement?.toLowerCase().includes(search.toLowerCase())
  );

  // Filtrer les utilisateurs selon le département saisi
  const filteredUsersByDept = users
    .filter(u => u.department.toLowerCase() === form.departement.toLowerCase())
    .sort((a, b) => {
      if (a.role === "Responsable" && b.role !== "Responsable") return -1;
      if (a.role !== "Responsable" && b.role === "Responsable") return 1;
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="dashboard">
      <main className="main">
        <div className="budget-page">
          <h2>Gestion des budgets</h2><br />

          <form onSubmit={handleSubmit} className="card">
            <h3>{editIndex !== null ? "Modifier un budget" : "Ajouter un budget"}</h3><br />

            {/* Input département */}
            <input
              type="text"
              placeholder="Nom du département"
              value={form.departement}
              onChange={(e) => setForm({ ...form, departement: e.target.value, responsable: "" })}
              required
            />

            {/* Select responsables/utilisateurs du département */}
            <select
              value={form.responsable}
              onChange={(e) => {
                const selectedUser = users.find(u => u.name === e.target.value);
                if (selectedUser) {
                  setForm({
                    ...form,
                    responsable: selectedUser.name,
                    departement: selectedUser.department
                  });
                } else {
                  setForm({ ...form, responsable: "" });
                }
              }}
              required
              disabled={!form.departement}
            >
              <option value="">
                {form.departement
                  ? "Sélectionnez un responsable/utilisateur"
                  : "Saisissez un département d'abord"}
              </option>

              {filteredUsersByDept.map((user, i) => (
                <option key={i} value={user.name}>
                  {user.name} ({user.role || ""})
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Montant"
              value={form.montant}
              onChange={(e) => setForm({ ...form, montant: e.target.value })}
              required
            />

            <input
              type="date"
              placeholder="Date d'ajout"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            ></textarea>

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
                <th>Description</th>
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
                  <td>{b.description}</td>
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
