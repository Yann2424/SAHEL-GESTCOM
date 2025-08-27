import React, { useState } from "react";
import "../Administrateur/Utilisateur.css";
import {
	FaUserCircle,
	FaEnvelope,
	FaFolderOpen,
	FaWallet,
	FaReceipt,
	FaSearch,
} from "react-icons/fa";

const initialUsers = [
	{
		name: "Alice Dupont",
		email: "alice.dupont@example.com",
		téléphone: "‪+237 673637833‬",
		department: "Finance",
		budget: 50000,
		expenses: [
			{ motif: "Formation", date: "2025-01-15", montant: 2000 },
			{ motif: "Voyage", date: "2025-03-10", montant: 1500 },
		],
	},
	{
		name: "Marc Durand",
		email: "marc.durand@example.com",
		téléphone: "‪+237 673637834‬",
		department: "Informatique",
		budget: 70000,
		expenses: [
			{ motif: "Serveurs", date: "2025-02-05", montant: 10000 },
			{ motif: "Logiciels", date: "2025-04-22", montant: 3000 },
		],
	},
	{
		name: "Sophie Martin",
		email: "sophie.martin@example.com",
		téléphone: "‪+237 673637835‬",
		department: "Marketing",
		budget: 40000,
		expenses: [
			{ motif: "Campagne pub", date: "2025-02-20", montant: 8000 },
			{ motif: "Événement", date: "2025-05-14", montant: 5000 },
		],
	},
	{
		name: "Jean Petit",
		email: "jean.petit@example.com",
		téléphone: "‪+237 673637836‬",
		department: "Ressources Humaines",
		budget: 30000,
		expenses: [{ motif: "Recrutement", date: "2025-03-01", montant: 2500 }],
	},
	{
		name: "Paul Lambert",
		email: "paul.lambert@example.com",
		téléphone: "‪+237 673637837‬",
		department: "Finance",
		budget: 60000,
		expenses: [{ motif: "Audit", date: "2025-01-28", montant: 4000 }],
	},
	{
		name: "Julie Bernard",
		email: "julie.bernard@example.com",
		téléphone: "‪+237 673637838‬",
		department: "Informatique",
		budget: 80000,
		expenses: [{ motif: "Cloud", date: "2025-02-12", montant: 12000 }],
	},
	{
		name: "Eric Moreau",
		email: "eric.moreau@example.com",
		téléphone: "‪+237 673637839‬",
		department: "Marketing",
		budget: 45000,
		expenses: [{ motif: "SEO", date: "2025-03-30", montant: 2000 }],
	},
	{
		name: "Claire Robert",
		email: "claire.robert@example.com",
		téléphone: "‪+237 673637840‬",
		department: "Ressources Humaines",
		budget: 35000,
		expenses: [
			{ motif: "Formation interne", date: "2025-04-15", montant: 1500 },
		],
	},
	{
		name: "Lucas Fontaine",
		email: "lucas.fontaine@example.com",
		téléphone: "‪+237 673637841‬",
		department: "Finance",
		budget: 55000,
		expenses: [{ motif: "Conseil", date: "2025-05-05", montant: 3000 }],
	},
	{
		name: "Emma Leroy",
		email: "emma.leroy@example.com",
		téléphone: "‪+237 673637842‬",
		department: "Informatique",
		budget: 90000,
		expenses: [{ motif: "Sécurité", date: "2025-06-18", montant: 15000 }],
	},
];

function Utilisateur() {
	const [search, setSearch] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [users, setUsers] = useState(initialUsers);
	const [newUser, setNewUser] = useState({
		name: "",
		email: "",
		téléphone: "",
		department: "",
		budget: 0,
		expenses: [],
	});
	const [showForm, setShowForm] = useState(false);

	const filteredUsers = users.filter((user) =>
		user.name.toLowerCase().includes(search.toLowerCase())
	);

	const handleAddUser = (e) => {
		e.preventDefault();
		if (newUser.name && newUser.email && newUser.department) {
			setUsers([...users, newUser]);
			setNewUser({
				name: "",
				email: "",
				téléphone: "",
				department: "",
				budget: 0,
				expenses: [],
			});
			setShowForm(false); // Cacher le formulaire après l'ajout
		}
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
						{/* <FaSearch className="search-icon" /> */}
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
								<p>{selectedUser.department}</p>
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
								&times; {/* Unicode pour la croix */}
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
								<input
									type="text"
									placeholder="Département"
									value={newUser.department}
									onChange={(e) =>
										setNewUser({ ...newUser, department: e.target.value })
									}
									required
								/>
								<input
									type="number"
									placeholder="Budget"
									value={newUser.budget}
									onChange={(e) =>
										setNewUser({ ...newUser, budget: Number(e.target.value) })
									}
								/>
								<button type="submit" className="bt">Enregistrer</button>
							</form>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}

export default Utilisateur;
