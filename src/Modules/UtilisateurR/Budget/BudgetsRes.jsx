
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const GetbudgetFDepar = async (datas)=>{
    try{
        const q = query(
            collection(db, "Budgets"),
            where("departement", "==", datas.departement)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("Departement n'existe pas");
            return 0
        }
        const userDoc = querySnapshot.docs[0];
        return userDoc.data().montant || 0
    }catch(err){
        console.log('erreur lors de la recuperation du budget',err)
        return
    }
} 