import { 
  arrayUnion, 
  collection, 
  doc, 
  getDocs, 
  query, 
  updateDoc, 
  where, 
  addDoc 
} from "firebase/firestore"
import { db } from "../../firebase/firebase"



export const DepenseFUser = async (datas) => {
  try {
    
    const depRef = await addDoc(collection(db, "Depenses"), datas);

    
    const depenseAvecId = { id: depRef.id, ...datas };

    console.log(" Dépense ajoutée dans Depenses :", depenseAvecId);

    
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", datas.email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(" Utilisateur n'existe pas :", datas.email);
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, "Utilisateurs", userDoc.id);

    
    await updateDoc(userDocRef, {
      expenses: arrayUnion(depenseAvecId),
    });

    console.log(" Dépense ajoutée aussi chez l'utilisateur :", depenseAvecId);
  } catch (err) {
    console.log(" Erreur lors de l'ajout :", err);
  }
};


// 🔍 Récupérer les infos + dépenses d'un utilisateur
export const GetDepenseFUser = async (datas) => {
  try {
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", datas.email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(" L'utilisateur n'existe pas");
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
  } catch (err) {
    console.log(" Erreur lors de la récupération", err);
    return null;
  }
};



export const DeleteDepenseFUser = async (datas,depenseId) => {
  try {
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", datas.email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(" Utilisateur n'existe pas :", datas.email);
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, "Utilisateurs", userDoc.id);

    
    const updatedExpenses = (userDoc.data().expenses || []).filter(
      (exp) => exp.id !== depenseId
    );

    await updateDoc(userDocRef, { expenses: updatedExpenses });

    console.log(" Dépense supprimée :", depenseId);
  } catch (err) {
    console.log(" Erreur lors de la suppression :", err);
  }
};
