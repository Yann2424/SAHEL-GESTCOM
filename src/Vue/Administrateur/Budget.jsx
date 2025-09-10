import React, { useState, useEffect } from "react";
import "./Departement.css"; 
import { FaEdit } from "react-icons/fa";
import { NewBudget, GetBudget, UpdatedBudget } from "../../Modules/Budget/Budget_firebase";
import { GetManagerFDepartement, GetUser } from "../../Modules/User/User_firebase";
import { GetDepartement } from "../../Modules/Departement/Departement_firebase.jsx";

function BudgetPage() {
  const [budgets, setBudgets] = useState([]);
  const [departments,setDepartments] = useState([])
  const [forms, setForms] = useState({ name: "", manager: "" });
  const [users, setUsers] = useState([]);
  const [loading,setLoading] = useState(true)
  const [formLoading,setFormLoading] = useState(false)
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    departement: "",
    responsable: "",
    montant: "",
    date: "",
    description: ""
  });
  const [editIndex, setEditIndex] = useState(null);

  // Charger les départements
    useEffect(() => {
      const fetchDepartments = async () => {
        const data = await GetDepartement();
        if (Array.isArray(data)) {
          setDepartments(data);
        } else {
          console.error("Données reçues non valides :", data);
          setDepartments([]);
        }
        setLoading(false);
      };
      fetchDepartments();
    }, []);


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
  if(loading){
    return(
    <div>chargement...</div>
  )}

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.departement || !form.responsable || !form.montant || !form.date) {
      alert("Veuillez remplir tous les champs");
      return;
    }
    setFormLoading(true)
    try{
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
    } catch(err){
      console.log('erreur',err); 
    } finally{
      setFormLoading(false)
    }
  };

  const editBudget = (index) => {
    setForm(budgets[index]);
    setEditIndex(index);
  };

  const filteredBudgets = budgets.filter((b) =>
    b.departement?.toLowerCase().includes(search.toLowerCase())
  );

  const handleChangeDepartement =async (e)=>{
    const dept = e.target.value
    setForms({...forms, name: dept, manager:''})
    if(dept){
      const NomManager = await GetManagerFDepartement({name: dept})
      if(NomManager){
        setForm((prev) => ({
          ...prev,
          departement: dept,
          responsable: NomManager
        }));
      }
    }
  }

  return (
    <div className="dashboard">
      <main className="main">
        <div className="budget-page">
          <h2>Gestion des budgets</h2><br />

          <form onSubmit={handleSubmit} className="card">
            <h3>{editIndex !== null ? "Modifier un budget" : "Ajouter un budget"}</h3><br />

            {/* Input département */}
            <select
  						value={forms.name}
  						onChange={(e) => handleChangeDepartement(e)}
  						required
						>
  							<option value="">-- Sélectionnez un département --</option>
  							{departments.map((dep, i) => (
    							<option key={i} value={dep.name}>
      								{dep.name}
    							</option>
  							))}
						</select>

                <input type="text" 
                placeholder="manager"
                value={form.responsable}
                readOnly
                required
                />
      
          

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
              min={new Date(Date.now()-86400000).toISOString().split("T")[0]}
              max={new Date().toISOString().split("T")[0]}
            />

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            ></textarea>

            <button type="submit" className="btn">
              {editIndex !== null ? "Modifier" : "Ajouter"}
            </button>
            {formLoading && <div className="loaderyann"></div>}
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
