
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const NewRapportFUser = async (datas)=>{
    try{
        const docRef = doc(collection(db,"Rapports"),datas.email)
        await setDoc(docRef,datas)
        console.log("rapports ajouter",datas)

        const q = query(
            collection(db, "Utilisateurs"),
            where("email", "==", datas.email)
        )
    const querySnapshot = await getDocs(q);

    if(!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0]
        const userRef = doc(db, "Utilisateurs", userDoc.id)
        await updateDoc(userRef, { rapport: datas.rapport })
        console.log("rapports ajouter a l'utilisateur:",userDoc.id)
    }else{
        console.log("aucun rapport ajouter");
    }
    }catch(err){
        console.log("erreur lors de l'ajout du rapport",err)
    }
}

export const GetRapportFUser = async (datas)=>{
    try{
        const q = query(
            collection(db, "Utilisateurs"),
            where("email", "==", datas.email)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            console.log("Rapport n'existe pas");
            return 0
        }
        const rapport = querySnapshot.docs.map((doc)=>({
            id: doc.id,
            rapport : doc.rapport
        }))
    }catch(err){
        console.log('erreur lors de la recuperation du Rapport',err)
        return
    }
} 