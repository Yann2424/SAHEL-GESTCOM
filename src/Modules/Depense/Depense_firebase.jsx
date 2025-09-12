import { collection, deleteDoc, doc, getDoc, getDocs,updateDoc ,addDoc} from 'firebase/firestore'
import { db } from '../firebase/firebase'



export const  NewDepense =async (datas)=>{
  try{
     const docRef = await addDoc (collection(db,'Depenses'),datas)
    console.log('depense ajouter depuis !',docRef.id)
    return docRef.id
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
    })).filter((items)=> items.budgetId === undefined || items.budgetId === null)
    return dataList
  } catch(err){
    console.log('erreur lors de la recuperation',err)
    return []
  }
}

export const UpdateDepense = async (id,newDatas) =>{
  try{
    if (!id) {
      console.error("id Depense invalide:",id);
      return;
    }
    const docRef = doc(db,'Depenses',id)
    await updateDoc(docRef,newDatas)
    console.log('Depense modifier !');
  } catch(err){
    console.log('erreur lors de l/update :',err)
  }
}


export const DeleteDepense = async (id)=>{
  try{
    const docRef = doc(db,'Depenses',id)
    const docSnapshot = await getDoc(docRef)
    if(!docSnapshot.exists()){
      console.log('cette Depense n"existe pas');
      return
    }
    await deleteDoc(docRef)
    console.log('depense supprime !')
  } catch(err){
    console.log('erreur lors du delete :',err)
  }
}




