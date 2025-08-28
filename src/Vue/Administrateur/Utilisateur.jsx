import React, { useState, useEffect } from "react";
import "../Administrateur/Utilisateur.css";
import {
	FaUserCircle,
	FaEnvelope,
	FaFolderOpen,
	FaWallet,
	FaReceipt,
} from "react-icons/fa";
import { NewUser, GetUser, UpdateUser } from "../../Modules/User/User_firebase";

const departments = [
	"Finance",
	"Informatique",
	"Marketing",
	"Ressources Humaines",
];

function Utilisateur() {
	const [search, setSearch] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [users, setUsers] = useState([]);
	const [newUser, setNewUser] = useState({
		name: "",
		email: "",
		téléphone: "",
		department: "",
		budget: 0,
		expenses: [],
	});
	const [showForm, setShowForm] = useState(false);

	useEffect(() => {
		async function fetchUsers() {
			const data = await GetUser();
			setUsers(data);
		}
		fetchUsers();
	}, []);

	const filteredUsers = users.filter((user) =>
		user.name.toLowerCase().includes(search.toLowerCase())
	);

	const handleAddUser = async (e) => {
		e.preventDefault();
		if (newUser.name && newUser.email && newUser.department) {
			await NewUser(newUser);
			setUsers([...users, newUser]);
			setNewUser({
				name: "",
				email: "",
				téléphone: "",
				department: "",
				budget: 0,
				expenses: [],
			});
			setShowForm(false);
		}
	};

	const handleUpdateUser = async (updatedUser) => {
		if (!selectedUser) return;
		await UpdateUser(selectedUser, updatedUser, updatedUser.email);
		const updatedUsers = users.map((u) =>
			u.email === selectedUser.email ? updatedUser : u
		);
		setUsers(updatedUsers);
		setSelectedUser(updatedUser);
	};

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
								{user.name}
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
							</div>

							<div className="card">
								<h3>
									<FaFolderOpen /> Département
								</h3>
								<p>{selectedUser.department}</p>{" "}
								
							</div>

							<div className="card">
								<h3>
									<FaWallet /> Budget alloué
								</h3>
								<p>{selectedUser.budget.toLocaleString()} F</p>
							</div>

							<div className="card">
								<h3>
									<FaReceipt /> Dépenses effectuées
								</h3>
								<ul>
									{selectedUser.expenses.map((e, i) => (
										<li key={i}>
											{e.motif} - {e.date} : {e.montant.toLocaleString()} F
										</li>
									))}
								</ul>
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
								<select
									value={newUser.department}
									onChange={(e) =>
										setNewUser({ ...newUser, department: e.target.value })
									}
									required
								>
									<option value="">Sélectionnez un département</option>
									{departments.map((dep, i) => (
										<option key={i} value={dep}>
											{dep}
										</option>
									))}
								</select>

								<input
									type="number"
									placeholder="Budget"
									value={newUser.budget}
									onChange={(e) =>
										setNewUser({ ...newUser, budget: Number(e.target.value) })
									}
								/>
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
