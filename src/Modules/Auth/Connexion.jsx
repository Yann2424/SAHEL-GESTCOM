import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";


export default function Connexion() {
  const [step, setStep] = useState('welcome')
  const [error,setError ] = useState('')
  const {register, handleSubmit,reset,formState:{errors}} =useForm()

  const welcome = ()=>{
    setStep('welcome')
    reset()
    setError('')
  }
  const soumission = async(data)=>{
    const {email,password,nom,telephone} = data

    try{
      if(step === 'signup'){
        const users = await createUserWithEmailAndPassword(auth,email,password)
        console.log('utilisateur inscrit :',users.user)
        reset()
      } else if(step === 'login'){
        const users = await signInWithEmailAndPassword (auth,email,password)
        console.log ('utilisateur connecte :',users.user)
        reset()
        setError('')
      } 
    } catch(err){
      console.error('erreuer firebase :',err.message)
      if (step === 'signup'){
        switch(err.code){
        case 'auth/invalid-email':
          setError("L'adresse email est invalide")
        break
        default:
        setError("Une erreur est survenue  ")
      }
      } else if ( step === 'login'){
        switch (err.code){
          case 'auth/wrong-password':
          setError("Mot de passe incorrect")
        break
        case 'auth/user-not-found':
          setError("Utilisateur introuvable")
        break
        case 'auth/email-already-in-use':
          setError("Cet email est déjà utilisé")
        break
        default:
          setError('')
        }
      }
    }
  }

  return (
    <div className="w-full h-screen maz-w-[400px] flex justify-center items-center ">
      {step === "welcome" && (
        <div className="text-center p-5 animate-fadeIn">
          <h1 className="font-bold mb-3 text-slate-50 text-[3.8rem] shadow-md">Bienvenue</h1>
          <h2 className="text-[3rem] animate-zoomIn">GESCOM</h2>
          <div className="m-4 text-[1.1rem] animate-fadeIn">
            <p className="text-[15px]">
              Gérez votre argent et vos transactions simplement, grâce à une solution moderne, intuitive et sécurisée pour une gestion optimale
            </p>
          </div>
          <button onClick={() => setStep("signup")} className="text-xl text-slate-50 p-3 mt-[20px] border rounded-[30px] hover:opacity-90%
            bg-gradient-to-br from-[#0b3d91] to-[#f29544]  p-[12px] w-full rounded-[25px] text-bold cursor-pointer">
            S'inscrire
          </button>
          <p className="mt-[3px] text-[15px] ">
            Vous avez déjà un compte ?{" "}
            <span className="text-[#] text-bold cursor-pointer hover:text-[#f29544]" onClick={() => setStep("login")}>Se connecter</span>
          </p>
        </div>
      )}

      {step === "signup" && (
        <div className="bg-white w-[400px] rounded-[20px] p-[30px] text-center shadow-lg text-slate-900">
          <h1 className="mb-[10px] bg-gradient-to-br from-[#0b3d91] to-[#f29544] bg-clip-text text-transparent text-3xl ">S'inscrire</h1>
          <p className="text-[14px] text-slate-900 mb-[20px]">Pour continuer</p>
          <form 
          onSubmit={handleSubmit(soumission)} 
          className="space-y-4" 
          noValidate
          >
            <input 
            {...register('nom', {required : 'ce champ est Requis'})}
            type="text" 
            placeholder="Nom d'utilisateur" 
            className="text-slate-900 w-[97%] p-[12px] m-[8px 0] 
            border rounded-[10px] outline-none text-[14px] 
            focus:border focus:border-[#ddd] "
            />
            {errors.nom && (<p className="text-red-500 text-sm mt-1">
              {errors.nom.message}
            </p>)}
          <input 
          {...register('email',
            {required : 'ce champ est requis ', 
            pattern: {value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
            message:'adresse email invalid'}})
          }
          type="email" 
          placeholder="Email" 
          className="text-slate-900 w-[97%] p-[12px] m-[8px 0] 
          border rounded-[10px] outline-none text-[14px] focus:border 
          focus:border-[#ddd] "
          />
          {errors.email && (<p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>)}
          <input
           {...register('telephone',
            {required : 'ce champ est requis ', 
            pattern: {value:/^[0-9]{9}$/, 
            message:'numero de telephone invalid'}})
          }
          type="phone" 
          placeholder="Numéro de téléphone" 
          className="text-slate-900 w-[97%] p-[12px] m-[8px 0] 
          border rounded-[10px] outline-none text-[14px] 
          focus:border focus:border-[#ddd]"
          />
          {errors.telephone && (<p className="text-red-500 text-sm mt-1">
              {errors.telephone.message}
            </p>)}
          <input 
          {...register('password',
            {required : 'ce champ est requis ', 
            pattern: {message:'mots de passe incorrect'}})
          }
          type="password" 
          placeholder="Mot de passe" 
          className="text-slate-900 w-[97%] p-[12px] m-[8px 0] 
            border rounded-[10px] outline-none text-[14px] 
            focus:border focus:border-[#ddd]"
          />
          {errors.password && (<p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>)
          }
          { error && <p className="text-red-500 text-sm mt-1"> {error}</p>}
          <button
          type="submit" 
          className="bg-gradient-to-br from-[#0b3d91] 
          to-[#f29544] text-white p-[12px] w-full 
          rounded-[25px] text-bold cursor-pointer mt-[15px]">
            S'inscrire
          </button>
          </form>
          <p className="mt-[15px] text-[15px]">
            Vous avez déjà un compte ?{" "}
            <span className="text-[#0b3d91] text-bold cursor-pointer transition-all" onClick={() => setStep("login")}>Se connecter</span>
          </p>
          <p className="link">
            <span className="text-[#0b3d91] text-bold cursor-pointer transition-all" onClick={welcome}>← Retour à l'accueil</span>
          </p>
        </div>
      )}

      {step === "login" && (
        <div className="bg-white rounded-[20px] p-[30px] text-center shadow-lg text-slate-900">
          <h1 className="mb-[10px] bg-gradient-to-br from-[#0b3d91] to-[#f29544] bg-clip-text text-transparent text-3xl ">Se connecter</h1>
          <p className="text-[14px] text-[#555] mb-[20px]">Pour continuer</p>
          <form 
          onSubmit={handleSubmit(soumission)} 
          className="space-y-4" 
          noValidate
          >
          <input
          {...register('email',
            {required : 'ce champ est requis ', 
            pattern: {value:/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
            message:'adresse email invalid'}})
          }
          className="text-slate-900 w-[97%] p-[12px] m-[8px 0] 
          border rounded-[10px] outline-none text-[14px] 
          focus:border focus:border-[#ddd] "
          type="email" 
          placeholder="Email"  
          />
          {errors.email && (<p className="text-red-500 text-sm mt-1">
              {errors.email.message}
            </p>)}
          <input
          {...register('password',
            {required : 'ce champ est requis ', 
            pattern: {message:'mots de passe incorrect'}})
          }
          className="text-slate-900 w-[97%] p-[12px] m-[8px 0] 
            border rounded-[10px] outline-none text-[14px] focus:border focus:border-[#ddd] " 
          type="password" 
          placeholder="Mot de passe" 
          />
          {errors.password && (<p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>)
          }
          {error && (<p className="text-red-500 text-sm">
            {error}
          </p>)

          }
          <button 
          type="submit"
          className="bg-gradient-to-br from-[#0b3d91] to-[#f29544] text-white p-[12px] w-full rounded-[25px] text-bold cursor-pointer mt-[15px]">Se connecter</button>
          </form>
          <p className="mt-[15px] text-[15px] ">
            Vous n'avez pas de compte ?{" "}
            <span 
            className="text-[#0b3d91] text-bold cursor-pointer transition-all"
            onClick={() => setStep("signup")}>S'inscrire</span>
          </p>
          <p className="mt-[15px] text-[15px] ">
            <span 
            className="text-[#0b3d91] text-bold cursor-pointer transition-all"
            onClick={welcome}>← Retour à l'accueil</span>
          </p>
        </div>
      )}
    </div>
  );
  
}
