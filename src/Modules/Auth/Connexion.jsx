import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../firebase/firebase";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Connexion() {
	const [step, setStep] = useState("welcome");
	const [error, setError] = useState("");
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();
	const navigate = useNavigate();

	const welcome = () => {
		setStep("welcome");
		reset();
		setError("");
	};

	const soumission = async (data) => {
		const { email, password, nom, role } = data;
		try {
			if (step === "signup") {
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				localStorage.setItem("username", nom);
				localStorage.setItem("role", role);
				if (role === "admin") navigate("/dashboard/admin");
				else navigate("/dashboard/responsable");
			} else if (step === "login") {
				const userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
				localStorage.setItem("username", email.split("@")[0]);
				const userRole = localStorage.getItem("role") || "admin";
				if (userRole === "admin") navigate("/dashboard/admin");
				else navigate("/dashboard/responsable");
			}
			reset();
			setError("");
		} catch (err) {
			setError("Erreur : " + err.message);
		}
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#0b3d91] to-[#f29544] p-4 text-center text-white">
			{step === "welcome" && (
				<>
					<h1 className="text-6xl font-bold mb-3 animate-fadeIn">Bienvenue</h1>
					<h2 className="text-5xl font-semibold mb-6 animate-zoomIn">GESCOM</h2>
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
						<span
							className="underline cursor-pointer"
							onClick={() => setStep("login")}
						>
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
								{errors.nom && (
									<p className="text-red-500 text-sm">{errors.nom.message}</p>
								)}
							</>
						)}

						<input
							{...register("email", {
								required: "Ce champ est requis",
								pattern: {
									value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
									message: "Adresse email invalide",
								},
							})}
							type="email"
							placeholder="Email"
							className="w-full p-3 border rounded-xl text-gray-900 outline-none"
						/>
						{errors.email && (
							<p className="text-red-500 text-sm">{errors.email.message}</p>
						)}

						<input
							{...register("password", { required: "Ce champ est requis" })}
							type="password"
							placeholder="Mot de passe"
							className="w-full p-3 border rounded-xl text-gray-900 outline-none"
						/>
						{errors.password && (
							<p className="text-red-500 text-sm">{errors.password.message}</p>
						)}

						{error && <p className="text-red-500 text-sm">{error}</p>}
						<select
							{...register("role", { required: "Veuillez choisir un rôle" })}
							className="w-full p-3 border rounded-xl text-gray-900"
						>
							<option value="">-- Sélectionnez le rôle --</option>
							<option value="admin">Administrateur</option>
							<option value="responsable">Responsable</option>
						</select>
						{errors.role && (
							<p className="text-red-500 text-sm">{errors.role.message}</p>
						)}

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
								<span
									className="text-[#0b3d91] font-semibold cursor-pointer"
									onClick={() => setStep("login")}
								>
									Se connecter
								</span>
							</>
						) : (
							<>
								Vous n'avez pas de compte ?{" "}
								<span
									className="text-[#0b3d91] font-semibold cursor-pointer"
									onClick={() => setStep("signup")}
								>
									S'inscrire
								</span>
							</>
						)}
					</p>

					<p className="mt-2 text-sm">
						<span
							className="text-[#0b3d91] font-semibold cursor-pointer"
							onClick={welcome}
						>
							← Retour à l'accueil
						</span>
					</p>
				</div>
			)}
		</div>
	);
}
