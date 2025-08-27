import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'



export const  NewUser =async (datas)=>{
  try{
    const docRef = doc (collection(db,'Utilisateurs'),datas.email)
    const docSnapshot = await getDoc(docRef)

    if(docSnapshot.exists()){
      console.log('Utilisateurs existe deja!')
      return
    }
    await setDoc (docRef,datas)
    console.log('Utilisateurs ajouter!')
    
  }catch(err){
    console.log('erreur d"envoi',err)
  }
}

export const GetUser = async()=>{
  try{
    const querySnapshot = await getDocs (collection(db,'Utilisateurs'))
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

export const UpdateUser = async (datas,newDatas,newEmail) =>{
  try{
    if (!datas?.email) {
      console.error("Ancien email invalide:", datas);
      return;
    }
    if (!newEmail) {
      console.error("Nouveau email invalide:", newEmail);
      return;
    }
    const docRef = doc(db,'Utilisateurs',datas.email)
    const docSnapshot = await getDoc(docRef)
    if(!docSnapshot.exists()){
      console.log('cette utilisateur n"existe pas');
      return
    }
    
    const newDocRef = doc(db,'Departements',newEmail)
    await setDoc(newDocRef,newDatas)

    await deleteDoc(docRef)
    console.log('Utilisateurs modifier !');
    
  } catch(err){
    console.log('erreur lors de l/update :',err)
  }
}