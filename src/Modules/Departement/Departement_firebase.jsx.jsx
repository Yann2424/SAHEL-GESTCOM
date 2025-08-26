import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore'
import { db } from '../firebase/firebase'



export const  NewDepartement =async (datas)=>{
  try{
    const docRef = doc (collection(db,'Departements'),datas.name)
    const docSnapshot = await getDoc(docRef)

    if(docSnapshot.exists()){
      console.log('departement existe deja depuis from !')
      return
    }
    await setDoc (docRef,datas)
    console.log('departement ajouter depuis from !')
    
  }catch(err){
    console.log('erreur d"envoi',err)
  }
}

export const GetDepartement = async()=>{
  try{
    const querySnapshot = await getDocs (collection(db,'Departements'))
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

export const UpdateDepartement = async (datas,newDatas,newName) =>{
  try{
    if (!datas?.name) {
      console.error("Ancien nom de département invalide:", datas);
      return;
    }
    if (!newName) {
      console.error("Nouveau nom de département invalide:", newName);
      return;
    }
    const docRef = doc(db,'Departements',datas.name)
    const docSnapshot = await getDoc(docRef)
    if(!docSnapshot.exists()){
      console.log('ce departement n"existe pas');
      return
    }
    // cree un nouveau document
    const newDocRef = doc(db,'Departements',newName)
    await setDoc(newDocRef,newDatas)

    await deleteDoc(docRef)
    console.log('departement modifier !');
    
  } catch(err){
    console.log('erreur lors de l/update !',err)
  }
}


export const DeleteDepartement = async (datas)=>{
  try{
    const docRef = doc(collection(db,'Departements',datas.name))
    const docSnapshot = await getDoc(docRef)
    if(!docSnapshot.exists()){
      console.log('departement n"existe pas');
      return
    }
    await deleteDoc(docRef,datas)
    console.log('departement supprime !')
  } catch(err){
    console.log('erreur lors du delete',err)
  }
}




