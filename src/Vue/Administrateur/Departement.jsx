import React, { useState, useEffect } from "react";
import "./Departement.css";
import { FaToggleOn, FaToggleOff, FaEdit, FaTrash } from "react-icons/fa";
import {
	NewDepartement,
	GetDepartement,
	UpdateDepartement,
	DeleteDepartement,
} from "../../Modules/Departement/Departement_firebase.jsx.jsx";
import { GetUser } from "../../Modules/User/User_firebase";

function DepartmentsPage() {
	const [departments, setDepartments] = useState([]);
	const [users, setUsers] = useState([]);
	const [search, setSearch] = useState("");
	const [form, setForm] = useState({ name: "", manager: "" });
	const [editIndex, setEditIndex] = useState(null);
	const [loading, setLoading] = useState(true);
	const [submitting, setSubmitting] = useState(false);
	const [message, setMessage] = useState("");
	const [Modal,setModal] = useState(false)
	const [newDept,setNewDept] = useState('')
	const [Modals,setModals] = useState(true)

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

	// Charger les utilisateurs
	useEffect(() => {
		const fetchUsers = async () => {
			const data = await GetUser();
			if (Array.isArray(data)) {
				setUsers(data);
			} else {
				setUsers([]);
			}
		};
		fetchUsers();
	}, []);

	const showMessage = (text) => {
		setMessage(text);
		setTimeout(() => setMessage(""), 3000);
	};

	const toggleActive = async (index) => {
		const updated = [...departments];
		const departement = updated[index];
		console.log("departement",departement)
    	// Appel Firestore pour mettre à jour le statut du responsable
    	await UpdateDepartement(departement, departement, departement.name);
		updated[index].active = !updated[index].active;
		setDepartments(updated);

		if (updated[index].active) {
			showMessage(`Le responsable ${updated[index].manager} est maintenant actif ✅`);
		} else {
			showMessage(`Le responsable ${updated[index].manager} est maintenant inactif ❌`);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const departmentExists = departments.some((d) => d.name === form.name);

		if (departmentExists && editIndex === null) {
			alert("Un département avec ce nom existe déjà.");
			return;
		}

		if (form.name && form.manager) {
			setSubmitting(true);

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
			setSubmitting(false);
		}
	};

	const deleteDepartment = async (index) => {
		await DeleteDepartement(departments[index]);
		setDepartments(departments.filter((_, i) => i !== index));
	};

	const editDepartment = (index) => {
		setForm({
			name: departments[index].name,
			manager: departments[index].manager,
		});
		setEditIndex(index);
	};

	const filteredDepartments = Array.isArray(departments)
		? departments.filter((d) =>
				d.name.toLowerCase().includes(search.toLowerCase())
		  )
		: [];

		  const getuseroption = ()=>{
			return users.filter((u)=> u && u.name).sort((a,b)=>a.name.localeCompare(b.name))
		  }

	if (loading) {
		return <div>Chargement...</div>;
	}
	const gerer = (i)=>{
		 editDepartment(i)
		 setModals(true)
	}

	return (
		<div className="dashboard">
			{Modal && (
				<div className="modal">
					<div className="modal-content">
						<button 
						className="close-button"
						onClick={()=> setModal(false)}
						>
							&times;
						</button>
						<h3>ajouter un nouveau departement</h3>
						<input 
						type="text" 
						placeholder="nom departement"
						value={newDept}
						onChange={(e)=> setNewDept(e.target.value)}
						required
						/>
						<select
							value={form.manager}
							onChange={(e) => {
								const selectedUser = users.find((u) => u.name === e.target.value);
								if (selectedUser) {
									setForm({
										...form,
										manager: selectedUser.name,
										department: newDept,
									});
								} else {
									setForm({ ...form, manager: "", department: "" });
								}
							}}
							required
							disabled={!newDept.trim()}
						>
							<option value="">
								{newDept
									? "Sélectionnez un responsable"
									: "ajouter un département d'abord"}
							</option>
							{getuseroption().map((u,i)=>(
								<option key={i} value={u.name}>
									{u.name}
								</option>
							))}
					
						</select>
						<br />
						<button
  className="btn"
  onClick={async () => {
    if (newDept.trim()) {
      const newdeptdata = { name: newDept, active: true, manager: form.manager };

      // ⚡ Firestore renvoie true si le département est bien créé
      const success = await NewDepartement(newdeptdata);

      if (success) {
        setDepartments([...departments, newdeptdata]); 
        setForm({ ...form, name: newDept, manager: "" });
        setNewDept("");
        setModal(false);
        console.log("Département ajouté dans le select ");
      } else {
        console.log("Création du département refusée ");
      }
    }
  }}
>
  Enregistrer
</button>
					</div>
				</div>
			)}
			<main className="main">
				<div className="departments-page ">
					<div className="flex justify-between">
						<h2>Gestion des départements</h2>
					{message && <div className="notification">{message}</div>}
					<button 
					type="button"
					className="btn"
					onClick={()=> setModal(true)}
					>
						Ajouter un nouveau departement
					</button>
					</div>
					<br />
					{Modals &&  (
						<div>
							<button 
							className="text-black text-2xl p-2 hover:bg-slate-500 "
							onClick={()=> setModals(false)}>&times;</button>
							<form onSubmit={handleSubmit} className="card">
						<div className="flex justify-between">
							<h3>Modifier un Departement</h3>
						</div>
						{/* Select pour choisir le nom du département (depuis Firestore) */}
						<select
  						value={form.name}
  						onChange={(e) => setForm({ ...form, name: e.target.value, manager: "" })}
  						required
						>
  							<option value="">-- Sélectionnez un département --</option>
  							{departments.map((dep, i) => (
    							<option key={i} value={dep.name}>
      								{dep.name}
    							</option>
  							))}
						</select>

						{/* Select qui affiche les responsables/utilisateurs du département saisi */}
						<select
							value={form.manager}
							onChange={(e) => {
								const selectedUser = users.find((u) => u.name === e.target.value);
								if (selectedUser) {
									setForm({
										...form,
										manager: selectedUser.name,
										department: selectedUser.department,
									});
								} else {
									setForm({ ...form, manager: "", department: "" });
								}
							}}
							required
							disabled={!form.name}
						>
							<option value="">
								{form.name
									? "Sélectionnez un responsable"
									: "selectionner un département d'abord"}
							</option>
							{getuseroption().map((u,i)=>(
								<option key={i} value={u.name}>
									{u.name}
								</option>
							))}
					
						</select>

						<br /><br />

						<button type="submit" className="btn" disabled={submitting}>
							{submitting
								? "Chargement..."
								: editIndex !== null
								? "Mettre à jour"
								: "Ajouter"}
						</button>
					</form>
					
						</div>
					)}

					<br />
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
											<FaToggleOn
												className="icon-active"
												onClick={() => toggleActive(i)}
											/>
										) : (
											<FaToggleOff
												className="icon-inactive"
												onClick={() => toggleActive(i)}
											/>
										)}
									</td>
									<td>
										<FaEdit
											className="icon-edit"
											onClick={() =>gerer(i)}
										/>
										<br />
										<FaTrash
											className="icon-delete"
											onClick={() => deleteDepartment(i)}
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

export default DepartmentsPage;


// {/* <main className="main">
// 				<div className="departments-page w-full ">
// 					<div className="flex justify-between">
// 						<h2>Gestion des départements</h2>
// 					{message && <div className="notification">{message}</div>}
// 					<button 
// 					type="button"
// 					className="btn"
// 					onClick={()=> setModal(true)}
// 					>
// 						Ajouter un nouveau departement
// 					</button>
// 					</div>
// 					<br />
// 					{Modals &&  (
// 						<div>
// 							<button 
// 							className="text-black text-2xl p-2 hover:bg-slate-500 "
// 							onClick={()=> setModals(false)}>&times;</button>
// 							<form onSubmit={handleSubmit} className="card">
// 						<div className="flex justify-between">
// 							<h3>Modifier un Departement</h3>
// 						</div>
// 						{/* Select pour choisir le nom du département (depuis Firestore) */}
// 						<select
//   						value={form.name}
//   						onChange={(e) => setForm({ ...form, name: e.target.value, manager: "" })}
//   						required
// 						>
//   							<option value="">-- Sélectionnez un département --</option>
//   							{departments.map((dep, i) => (
//     							<option key={i} value={dep.name}>
//       								{dep.name}
//     							</option>
//   							))}
// 						</select>

// 						{/* Select qui affiche les responsables/utilisateurs du département saisi */}
// 						<select
// 							value={form.manager}
// 							onChange={(e) => {
// 								const selectedUser = users.find((u) => u.name === e.target.value);
// 								if (selectedUser) {
// 									setForm({
// 										...form,
// 										manager: selectedUser.name,
// 										department: selectedUser.department,
// 									});
// 								} else {
// 									setForm({ ...form, manager: "", department: "" });
// 								}
// 							}}
// 							required
// 							disabled={!form.name}
// 						>
// 							<option value="">
// 								{form.name
// 									? "Sélectionnez un responsable"
// 									: "selectionner un département d'abord"}
// 							</option>
// 							{getuseroption().map((u,i)=>(
// 								<option key={i} value={u.name}>
// 									{u.name}
// 								</option>
// 							))}
					
// 						</select>

// 						<br /><br />

// 						<button type="submit" className="btn" disabled={submitting}>
// 							{submitting
// 								? "Chargement..."
// 								: editIndex !== null
// 								? "Mettre à jour"
// 								: "Ajouter"}
// 						</button>
// 					</form>
					
// 						</div>
// 					)}

// 					<br />
// 					<div className="search-container">
// 						<input
// 							type="text"
// 							placeholder="Rechercher un département..."
// 							value={search}
// 							onChange={(e) => setSearch(e.target.value)}
// 							className="search-bar"
// 						/>
// 					</div>

// 					<table className="table">
// 						<thead>
// 							<tr>
// 								<th>Nom du département</th>
// 								<th>Responsable</th>
// 								<th>Statut</th>
// 								<th>Options</th>
// 							</tr>
// 						</thead>
// 						<tbody>
// 							{filteredDepartments.map((d, i) => (
// 								<tr key={i}>
// 									<td>{d.name}</td>
// 									<td>{d.manager}</td>
// 									<td>
// 										{d.active ? (
// 											<FaToggleOn
// 												className="icon-active"
// 												onClick={() => toggleActive(i)}
// 											/>
// 										) : (
// 											<FaToggleOff
// 												className="icon-inactive"
// 												onClick={() => toggleActive(i)}
// 											/>
// 										)}
// 									</td>
// 									<td>
// 										<FaEdit
// 											className="icon-edit"
// 											onClick={() =>gerer(i)}
// 										/>
// 										<br />
// 										<FaTrash
// 											className="icon-delete"
// 											onClick={() => deleteDepartment(i)}
// 										/>
// 									</td>
// 								</tr>
// 							))}
// 						</tbody>
// 					</table>
// 				</div>
// 			</main> */}