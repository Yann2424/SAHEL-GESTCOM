import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../firebase/firebase";


export const NewBudget =async (datas)=>{
  try{
    console.log("Datas reçues dans NewBudget:", datas);
    if (!datas) {
      console.log("Erreur : il manque des informations dans datas", datas);
      return;
    }
    const docRef = doc (db,'Budgets',`${datas.responsable }_${datas.departement}`)
    const docSnapshot = await getDoc(docRef)

    if(docSnapshot.exists()){
      console.log('Budget existe deja depuis from !')
      return
    }
    await setDoc (docRef,datas)
    console.log('Budget ajouter depuis from !')
    
  }catch(err){
    console.log('erreur d"envoi',err)
  }
}

export const GetBudget = async()=>{
  try{
    const querySnapshot = await getDocs (collection(db,'Budgets'))
    const dataList = querySnapshot.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))
    return dataList
  } catch(err){
    console.log('erreur lors de la recuperation',err)
    return []
  }
}

export const UpdatedBudget = async (datas,newDatas,newName) =>{
  try{
    if (!datas?.departement) {
      console.error("Ancien nom de département invalide:", datas);
      return;
    }
    if (!newName) {
      console.error("Nouveau nom de département invalide:", newName);
      return;
    }
    const docRef = doc(db,'Budgets',`${datas.responsable }_${datas.departement}`)
    const docSnapshot = await getDoc(docRef)
    if(!docSnapshot.exists()){
      console.log('ce Budget n"existe pas');
      return
    }
    // cree un nouveau document
    const newDocRef = doc(db,'Budgets',newName)
    await setDoc(newDocRef,newDatas)

    await deleteDoc(docRef)
    console.log('departement modifier !');
    
  } catch(err){
    console.log('erreur lors de l/update :',err)
  }
}



