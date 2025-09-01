
import { collection, deleteDoc, doc, getDocs, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";


export const NewRapportFUser = async (datas) => {
  try {
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", datas.email),
       where('role','==','responsable')
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Aucun utilisateur trouvé pour ce rapport");
      return;
    }

    
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "Utilisateurs", userDoc.id);

    
    const rapportUserRef = await addDoc(collection(userRef, "Rapports"), {
      rapport: datas.rapport,
      email: datas.email,
      statut: 'en attente',
      createdAt: new Date(), 
    });
    console.log("Rapport ajouté pour l'utilisateur:", userDoc.id)
    
    await addDoc(collection(db, "Rapports"), {
      rapport : datas.rapport,
      email: datas.email,
      statut: 'en attente',
      createAt: serverTimestamp(),
      userId: userDoc.id, 
    });
  } catch (err) {
    console.log("Erreur lors de l'ajout du rapport", err);
  }
};

export const ValidateRapport =async (rapport)=>{
  try {
    const  rapportUserRef = doc(db,"Utilisateurs",rapport.uid,"Rapports",rapport.id)
    await updateDoc(rapportUserRef,{
      statut: "valider"
    })
    console.log('rapport valider');
    
  } catch (error) {
    console.log('erreur lors de la validation du rapport',error)
  }
}
export const RefuserRapport = async (rapport)=>{
  try {
    const  rapportUserRef = doc(db,"Utilisateurs",rapport.uid,"Rapports",rapport.id)
    await deleteDoc(rapportUserRef)
    console.log('rapport refuser');
    
  } catch (error) {
    console.log('erreur lors du refus du rapport',error)
  }
}

export const GetRapportsFUser = async (datas) => {
  try {
    
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", datas.email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Aucun utilisateur trouvé");
      return [];
    }

    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "Utilisateurs", userDoc.id);

    
    const rapportsSnapshot = await getDocs(collection(userRef, "Rapports"));

    return rapportsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.log("Erreur lors de la récupération des rapports:", err);
    return [];
  }
};
