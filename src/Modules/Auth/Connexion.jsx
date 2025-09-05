import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { auth, db } from "../firebase/firebase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../Vue/Administrateur/AppContext";
import { collection, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore";

export default function Connexion() {
	const [step, setStep] = useState("welcome");
	const [error, setError] = useState("");
	const { register, handleSubmit, reset, formState: { errors } } = useForm();
	const navigate = useNavigate();
	const { setCurrentUser } = useContext(AppContext);

	const welcome = () => {
		setStep("welcome");
		reset();
		setError("");
	};

	const soumission = async (data) => {
		const { email, password, name, role } = data;
		try {
			localStorage.setItem("username", name || email.split("@")[0]);
			localStorage.setItem("role", role);

			if (step === "signup") {
				const userCredential = await createUserWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;

				// Mettre à jour le context
				setCurrentUser({
					email: user.email,
					displayName: name || user.email.split("@")[0],
					uid: user.uid
				});

				if (role === "admin") {
					const userRef = query(
							collection(db,"Utilisateurs"),
							where("role","==","admin")
					)
					const get = await getDocs(userRef)
					if(get.size >= 2){
						await auth.signOut()
						alert("Impossible de se connecter: le nombre d'admin est atteint")
						return
					}
					await setDoc(doc(db, "Utilisateurs", email), {
					nom : name ||data.email|| nom || data.nom || user.email.split("@")[0],
    				email: email,
    				role: "admin",
    				active: true 
  				});
					navigate("/dashboard/administrateur");
				}
				else {
					alert("Vous ne pouvez pas vous inscrire en etant responsable")
				}

			} else if (step === "login") {
				const userCredential = await signInWithEmailAndPassword(auth, email, password);
				const user = userCredential.user;
				
				const userEmail = user.email
					const qUser = query(
						collection(db,"Utilisateurs"),
						where("email","==",userEmail)
					)
					const userDocs = await getDocs(qUser)
					const userName= userDocs.docs[0].data().name
			
					// Vérifier dans Firestore
					const querySnapshot = await getDocs(
						query(collection(db, "Departements"), where("manager", "==", userName))
					);

				// Mettre à jour le context
				setCurrentUser({
					email: user.email,
					displayName: userName,
					uid: user.uid
				});

				const userRole = localStorage.getItem("role") || "admin";
				if (userRole === "admin") {


					const docRef = doc(db,"Utilisateurs",user.email)
					const docSnapshot = await getDoc(docRef)
					const data = docSnapshot.data();
					
					// Vérifier le rôle
					if (data.role !== "admin") {
  						await auth.signOut();
  						alert("Vous n'êtes pas autorisé a la page admin ");
						return;
					}
					navigate("/dashboard/administrateur");
				}
				else {
					
					
					if (querySnapshot.empty) {
						  await auth.signOut();
							  alert("Aucun département trouvé pour ce responsable");
						  return;
					}

    			const departementData = querySnapshot.docs[0].data();

    			if (departementData.active === false) {
      				await auth.signOut();
      				alert("Votre compte est désactivé");
      				return;
    			}
				navigate("/dashboard/responsable");
				}
			}

			reset();
			setError("");
		} catch (err) {
			setError("Erreur : " + err.message);
			console.log(err);	
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b3d91] to-[#f29544] p-4 text-center text-white">
			{step === "welcome" && (
				<>
					<h1 className="text-6xl font-bold mb-3 animate-fadeIn">Bienvenue</h1>
					<h2 className="text-5xl font-semibold mb-6 animate-zoomIn text-orange-400">
						GESCOM
					</h2>
					<p className="mb-8 text-lg max-w-xl">
						Gérez votre argent et vos transactions simplement, grâce à une
						solution moderne, intuitive et sécurisée pour une gestion optimale.
					</p>
					<button
						onClick={() => setStep("signup")}
						className="py-3 px-10 rounded-3xl font-bold bg-gradient-to-br from-[#0b3d91] to-[#f29544] hover:opacity-90 transition text-white text-xl"
					>
						S'inscrire
					</button>
					<p className="mt-4 text-lg">
						Vous avez déjà un compte ?{" "}
						<span className="underline cursor-pointer" onClick={() => setStep("login")}>
							Se connecter
						</span>
					</p>
				</>
			)}

			{(step === "signup" || step === "login") && (
				<div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-gray-900 animate-fadeIn">
					<h1 className="text-3xl font-bold mb-2 bg-gradient-to-br from-[#0b3d91] to-[#f29544] bg-clip-text text-transparent">
						{step === "signup" ? "S'inscrire" : "Se connecter"}
					</h1>
					<p className="text-gray-500 mb-6 text-sm">Pour continuer</p>

					<form onSubmit={handleSubmit(soumission)} className="space-y-4">
						{step === "signup" && (
							<>
								<input
									{...register("nom", { required: "Ce champ est requis" })}
									type="text"
									placeholder="Nom d'utilisateur"
									className="w-full p-3 border rounded-xl text-gray-900 outline-none"
								/>
								{errors.nom && <p className="text-red-500 text-sm">{errors.nom.message}</p>}
							</>
						)}

						<input
							{...register("email", {
								required: "Ce champ est requis",
								pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Adresse email invalide" }
							})}
							type="email"
							placeholder="Email"
							className="w-full p-3 border rounded-xl text-gray-900 outline-none"
						/>
						{errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

						<input
							{...register("password", { required: "Ce champ est requis" })}
							type="password"
							placeholder="Mot de passe"
							className="w-full p-3 border rounded-xl text-gray-900 outline-none"
						/>
						{errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

						{error && <p className="text-red-500 text-sm">{error}</p>}

						<select
							{...register("role", { required: "Veuillez choisir un rôle" })}
							className="w-full p-3 border rounded-xl text-gray-900"
						>
							<option value=""> Sélectionnez le rôle </option>
							<option value="admin">Administrateur</option>
							<option value="Responsable">Responsable</option>
						</select>
						{errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

						<button
							type="submit"
							className="w-full py-3 rounded-3xl font-bold text-white bg-gradient-to-br from-[#0b3d91] to-[#f29544] hover:opacity-90 transition"
						>
							{step === "signup" ? "S'inscrire" : "Se connecter"}
						</button>
					</form>

					<p className="mt-4 text-sm">
						{step === "signup" ? (
							<>
								Vous avez déjà un compte ?{" "}
								<span className="text-[#0b3d91] font-semibold cursor-pointer" onClick={() => setStep("login")}>
									Se connecter
								</span>
							</>
						) : (
							<>
								Vous n'avez pas de compte ?{" "}
								<span className="text-[#0b3d91] font-semibold cursor-pointer" onClick={() => setStep("signup")}>
									S'inscrire
								</span>
							</>
						)}
					</p>

					<p className="mt-2 text-sm">
						<span className="text-[#0b3d91] font-semibold cursor-pointer" onClick={welcome}>
							← Retour à l'accueil
						</span>
					</p>
				</div>
			)}
		</div>
	);
}
