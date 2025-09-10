import { collection, doc, getDoc, getDocs, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/firebase";


import {  addDoc } from "firebase/firestore";


export const NewBudget = async (datas) => {
  try {
    console.log("Datas reçues dans NewBudget:", datas);
    if (!datas?.responsable || !datas?.departement) {
      console.log("Erreur : il manque des informations dans datas", datas);
      return;
    }

    // Ajouter le budget dans Firestore avec un ID auto-généré
    const docRef = await addDoc(collection(db, "Budgets"), {
      ...datas,
      createAt: serverTimestamp()
    });

    console.log("Budget ajouté avec succès :", docRef.id);
  } catch (err) {
    console.log('Erreur lors de l’ajout du budget :', err);
  }
};


export const GetBudget = async()=>{
  try{
    const querySnapshot = await getDocs (collection(db,'Budgets'))
    const dataList = querySnapshot.docs.map((doc)=>({
      id:doc.id,
      ...doc.data(),
    }))
    return dataList
  } catch(err){
    console.log('erreur lors de la recuperation',err)
    return []
  }
}

export const UpdatedBudget = async (id, newDatas) => {
  try {
    if (!id) {
      console.error("ID du budget manquant :", id);
      return;
    }

    const docRef = doc(db, "Budgets", id);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      console.log("Ce budget n'existe pas :", id);
      return;
    }

    // Mets à jour le budget existant
    await setDoc(docRef, newDatas, { merge: true });
    console.log("Budget modifié avec succès !");
  } catch (err) {
    console.error("Erreur lors de la mise à jour du budget :", err);
  }
};
