import React, { useState, useEffect } from "react";
import "../Administrateur/Departement.css";
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
		setTimeout(() => setMessage(""), 3000); // 3 secondes
	};

	
	const toggleActive = (index) => {
		const updated = [...departments];
		updated[index].active = !updated[index].active;
		setDepartments(updated);

		// Affichage du message selon l'état
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
			setSubmitting(false); // ✅ cacher le loader
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

	// const toggleActive = (index) => {
	// 	const updated = [...departments];
	// 	updated[index].active = !updated[index].active;
	// 	setDepartments(updated);
	// };

	const filteredDepartments = Array.isArray(departments)
		? departments.filter((d) =>
				d.name.toLowerCase().includes(search.toLowerCase())
		  )
		: [];

	if (loading) {
		return <div>Chargement...</div>;
	}

	return (
		<div className="dashboard">
			<main className="main">
				<div className="departments-page">
					<h2>Gestion des départements</h2>
					{message && <div className="notification">{message}</div>}

					<br />
					<form onSubmit={handleSubmit} className="card">
						<h3>Ajouter un département</h3>
						<br />
						<input
							type="text"
							placeholder="Nom du département"
							value={form.department || form.name} 
							onChange={(e) => setForm({ ...form, name: e.target.value })}
						/>

						<select
							value={form.manager}
							onChange={(e) => {
								const selectedUser = users.find(
									(u) => u.name === e.target.value
								);
								if (selectedUser) {
									setForm({
										...form,
										manager: selectedUser.name,
										department: selectedUser.department, 
										name: selectedUser.department,
									});
								} else {
									setForm({ ...form, manager: "", department: "", name: "" });
								}
							}}
							required
						>
							<option value="">Sélectionnez un responsable</option>
							{users.map((user, i) => (
								<option key={i} value={user.name}>
									{user.name} ({user.department})
								</option>
							))}
						</select>

						{/* Affichage automatique du département
						{form.department && (
							<p>
								Département de l'utilisateur sélectionné :{" "}
								<strong>{form.department}</strong>
							</p>
						)} */}

						<br />
						<br />

						<button type="submit" className="btn" disabled={submitting}>
							{submitting
								? "Chargement..."
								: editIndex !== null
								? "Mettre à jour"
								: "Ajouter"}
						</button>
					</form>

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
											onClick={() => editDepartment(i)}
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
