import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase"


export const LoadUser = async ()=>{
    const users = auth.currentUser.email
    if(!users){
        console.log('aucun utilisateurs connecter');
        return
    }
}

export const LogOut = async (navigate)=>{
    try {
        await signOut(auth)
        navigate("/")
        console.log("Utilisateur deconnecte");
    } catch (error) {
        console.log("erreru lors de la decoonexion",error);
    }
}