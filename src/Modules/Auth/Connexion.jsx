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
	const [loader, setloader] = useState(false)
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
			
			setloader(true)
			if (step === "signup") {

			} else if (step === "login") {
				const userCredential = await signInWithEmailAndPassword(auth, email, password);
				
				const userRole = localStorage.getItem("role") ;
				if (userRole === "admin") {
					const user = userCredential.user;

					const docRef = doc(db,"Utilisateurs",user.email)
					const docSnapshot = await getDoc(docRef)
					const data = docSnapshot.data();
					if(!docSnapshot.exists()){
						alert("l'utilisateur n'existe pas")
						return
					}
					localStorage.setItem("username", data.name || email.split("@")[0]);
					localStorage.setItem("role", data.role);
					// Vérifier le rôle
					if (data.role !== "admin") {
  						await auth.signOut();
  						alert("Vous n'êtes pas autorisé a la page admin ");
						return;
					}
					navigate("/dashboard/administrateur");
				}
				else {
					const user = userCredential.user;
				
				const userEmail = user.email
					const qUser = query(
						collection(db,"Utilisateurs"),
						where("email","==",userEmail)
					)
					const userDocs = await getDocs(qUser)
					const userName= userDocs.docs[0].data().name
					console.log("username",userName);
					localStorage.setItem("username", userName || email.split("@")[0]);
					localStorage.setItem("role", userDocs.docs[0].data().role);
					
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
		} finally{
			setloader(false)
		}
	};

// 	const soumission = async (data) => {
//   const { email, password } = data;
//   try {
//     setloader(true);

//     if (step === "signup") return; // tu peux gérer l'inscription ici si besoin

//     // Connexion Firebase
//     const userCredential = await signInWithEmailAndPassword(auth, email, password);
//     const user = userCredential.user;

//     // Récupérer l'utilisateur depuis Firestore
//     const docRef = doc(db, "Utilisateurs", user.email);
//     const docSnapshot = await getDoc(docRef);

//     if (!docSnapshot.exists()) {
//       alert("L'utilisateur n'existe pas");
//       await auth.signOut();
//       return;
//     }

//     const userData = docSnapshot.data();

//     // Vérifier le rôle
//     if (userData.role === "admin") {
//       setCurrentUser({
//         email: user.email,
//         displayName: userData.name,
//         uid: user.uid,
//         role: "admin"
//       });
//       navigate("/dashboard/administrateur");
//       return;
//     }

//     if (userData.role !== "Responsable") {
//       await auth.signOut();
//       alert("Vous n'êtes pas autorisé à la page Responsable");
//       return;
//     }

//     // Vérifier le département pour les Responsables
//     const querySnapshot = await getDocs(
//       query(collection(db, "Departements"), where("manager", "==", userData.name))
//     );

//     if (querySnapshot.empty) {
//       await auth.signOut();
//       alert("Aucun département trouvé pour ce responsable");
//       return;
//     }

//     const departementData = querySnapshot.docs[0].data();
//     if (departementData.active === false) {
//       await auth.signOut();
//       alert("Votre compte est désactivé");
//       return;
//     }

//     // Tout est OK pour le Responsable
//     setCurrentUser({
//       email: user.email,
//       displayName: userData.name,
//       uid: user.uid,
//       role: "Responsable",
//       departement: departementData.name
//     });
//     navigate("/dashboard/responsable");

//   } catch (err) {
//     setError("Erreur : " + err.message);
//     console.log(err);
//   } finally {
//     setloader(false);
//   }
// };


	

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#213547] to-[#213547] p-4 text-center text-white">
		{/* #0b3d91,#f29544 */}
			{step === "welcome" && (
				<>
					<h1 className="text-6xl font-bold mb-3 animate-fadeIn">Bienvenue</h1>
					<h2 className="text-5xl font-semibold mb-6 animate-zoomIn text-orange-400">
						GESCOM
					</h2>
					<p className="mb-8 text-lg max-w-xl">
						Gérez votre argent et vos depenses simplement, grâce à une
						solution moderne, intuitive et sécurisée pour une gestion optimale.
					</p>
					<button
						onClick={() => setStep("login")}
						className="py-3 px-10 rounded-3xl font-bold bg-gradient-to-br from-[#0b3d91] to-[#f29544] hover:opacity-90 transition text-white text-xl"
					>
						Se Connecter
					</button>
					
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

						
						<select
							{...register("role", { required: "Veuillez choisir un rôle" })}
							className="w-full p-3 border rounded-xl text-gray-900"
						>
							<option value=""> Sélectionnez le rôle </option>
							<option value="admin">Administrateur</option>
							<option value="Responsable">Responsable</option>
						</select>
						{errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
						{error && <p className="text-red-500 text-sm">{error}</p>}

						<button
							type="submit"
							className="w-full py-3 rounded-3xl font-bold text-white bg-gradient-to-br from-[#0b3d91] to-[#f29544] hover:opacity-90 transition flex justify-center itmes-center"
						>
							{loader ? (
    							<div className="w-5 h-5 border-4 border-blue-500 border-t-transparent rounded-full animate-spin "></div>
  								) : (
    							step === "signup" ? "S'inscrire" : "Se connecter"
  							)}
						</button>
					</form>

					

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
