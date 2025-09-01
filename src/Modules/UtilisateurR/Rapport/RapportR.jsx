
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";

import { collection, query, where, getDocs, doc, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase"; // adapte le chemin selon ton projet

export const NewRapportFUser = async (datas) => {
  try {
    // Cherche l'utilisateur par email
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", datas.email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Aucun utilisateur trouvé pour ce rapport");
      return;
    }

    
    const userDoc = querySnapshot.docs[0];
    const userRef = doc(db, "Utilisateurs", userDoc.id);

    
    await addDoc(collection(userRef, "Rapports"), {
      rapport: datas.rapport,
      email: datas.email,
      createdAt: new Date(), 
    });
    console.log("Rapport ajouté pour l'utilisateur:", userDoc.id)
    
    await addDoc(collection(db, "Rapports"), {
      ...newRapport,
      userId: userDoc.id, 
    });
  } catch (err) {
    console.log("Erreur lors de l'ajout du rapport", err);
  }
};


import { collection, query, where, getDocs, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export const GetRapportsFUser = async (email) => {
  try {
    
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", email)
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
