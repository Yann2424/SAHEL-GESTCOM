import { collection, deleteDoc, doc, getDoc, getDocs,updateDoc ,addDoc} from 'firebase/firestore'
import { db } from '../firebase/firebase'



export const  NewDepense =async (datas)=>{
  try{
     await addDoc (collection(db,'Depenses'),datas)
    console.log('depense ajouter depuis !')
    
  }catch(err){
    console.log('erreur d"envoi',err)
  }
} 

export const GetDepense = async()=>{
  try{
    const querySnapshot = await getDocs (collection(db,'Depenses'))
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

export const UpdateDepense = async (datas,newDatas,) =>{
  try{
    if (!datas) {
      console.error("Ancien Depense invalide:", datas);
      return;
    }
    const docRef = doc(db,'Depenses',)
      await updateDoc(docRef,newDatas)
    
    console.log('Utilisateurs modifier !');
  } catch(err){
    console.log('erreur lors de l/update :',err)
  }
}


export const DeleteDepense = async ()=>{
  try{
    const docRef = doc(db,'Depenses',)
    const docSnapshot = await getDoc(docRef)
    if(!docSnapshot.exists()){
      console.log('cette Depense n"existe pas');
      return
    }
    await deleteDoc(docRef)
    console.log('departement supprime !')
  } catch(err){
    console.log('erreur lors du delete :',err)
  }
}




