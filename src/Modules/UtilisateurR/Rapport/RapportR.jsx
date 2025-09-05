
import { collection, addDoc, collectionGroup, doc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";


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
    const userName = userDoc.data().name
    
    await addDoc(collection(userRef, "Rapports"), {
      rapport: datas.rapport,
      name: userName,
      statut: "en attente",
      email: datas.email,
      createdAt: new Date(), 
    });
    console.log("Rapport ajouté pour l'utilisateur:", userDoc.id)
    
    await addDoc(collection(db, "Rapports"), {
      rapport : datas.rapport,
      createAt : new Date(),
      statut : "en attente",
      userId: userDoc.id, 
    });
  } catch (err) {
    console.log("Erreur lors de l'ajout du rapport", err);
  }
};


export const GetRapports = async () => {
  try {
    const querySnapshot = await getDocs(collectionGroup(db,"Rapports"))
    const dataList = querySnapshot.docs.map((doc)=>({
      id:doc.id,
      ...doc.data()
    }))
    return dataList 
  } catch (err) {
    console.log("Erreur lors de la récupération des rapports:", err);
    return [];
  }
};

export const ValideRapport = async(datas,id)=>{
  try{
    const rapportRef = doc(db,"Utilisateurs",datas.email,"Rapports",id)
    await updateDoc(rapportRef,{
      statut: "Valide",
      updateAt : new Date()
    })
    console.log(`rapport ${id} valide pour l'utilisateur ${datas.email}`)
  }catch(err){
    console.log("erreur lors de la validation du rapport ",err)
  }
}
export const refuserRapport = async(datas,id)=>{
  try{
    const rapportRef = doc(db,"Utilisateurs",datas.email,"Rapports",id)
    await updateDoc(rapportRef,{
      statut: "Refuse",
      updateAt : new Date()
    })
    console.log(`rapport ${id} refuser pour l'utilisateur ${datas.email}`)
  }catch(err){
    console.log("erreur lors du refus du rapport",err)
  }
}

export const GetRapportFUser = async(datas)=>{
  try {
    const q = query(
      collection(db,"Utilisateurs"),
      where("email","==",datas.email)
    )
    const querySnapshot = await getDocs(q)
    if(querySnapshot.empty){
      console.log("cette Utilisateur n'existe pas");
      return
    }
    const userDoc = querySnapshot.docs[0]
    const rapportSnapshot = await getDocs(
      collection(db,"Utilisateurs",userDoc.id,"Rapports")
    )
    console.log(`rapport  recuperer pour l'utilisateur ${datas.email}`)
    return rapportSnapshot.docs.map((doc)=>({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.log("erreur lors de la recuperation du rapport en fonction de l'utilisateur")
  }
}