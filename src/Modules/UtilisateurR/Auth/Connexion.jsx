import { auth } from "../../firebase/firebase"

export const LoadUser = async ()=>{
    const users = auth.currentUser.email
    if(!users){
        console.log('aucun utilisateurs connecter');
        return
    }
}

