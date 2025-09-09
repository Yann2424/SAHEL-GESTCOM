import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where,deleteField } from 'firebase/firestore'
import { db } from '../firebase/firebase'



export const  NewDepartement =async (datas)=>{
  try{
    
    const q = query(
      collection(db,"Utilisateurs"),
      where("name","==",datas.manager)
    )
    const querySnapshot = await getDocs(q)
    if(querySnapshot.empty){
      console.log("aucun utilisateur trouve pour manager");
      return
    }
    const user = querySnapshot.docs[0]
    if (user.data().departement) {
      alert(
        `L'utilisateur ${datas.manager} est déjà assigné au département: ${user.data().departement}`
      );
      return false
    }else{

      const docRef = doc (collection(db,'Departements'),datas.name)
      const docSnapshot = await getDoc(docRef)

    if(docSnapshot.exists()){
      const doc = docSnapshot.data().name
      alert(`le departement ${doc} existe deja  !`)
      return false
    }
    await setDoc (docRef,datas)
    console.log('departement ajouter depuis !')

      await setDoc(
        doc(db,"Utilisateurs",user.id),{
          departement: datas.name
        },{merge: true}
      )
      console.log(`departement ajouter pour l"utilisateur:${datas.name}`);
    return true
  }
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



export const UpdateDepartement = async (datas, newDatas, newName) => {
  try {
    if (!datas?.name) {
      console.error("Ancien nom de département invalide:", datas);
      return;
    }
    if (!newName) {
      console.error("Nouveau nom de département invalide:", newName);
      return;
    }

    const docRef = doc(db, "Departements", datas.name);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      console.log("Ce département n'existe pas");
      return;
    }

    // Cas 1 : le nom du département change
    if (newName !== datas.name) {
      const newDocRef = doc(db, "Departements", newName);
      await setDoc(newDocRef, newDatas);

      // Si le manager reste le même, mettre à jour Utilisateurs
      if (datas.manager === newDatas.manager) {
        const q = query(
          collection(db, "Utilisateurs"),
          where("name", "==", newDatas.manager)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const firstUserDoc = querySnapshot.docs[0];
          await updateDoc(doc(db, "Utilisateurs", firstUserDoc.id), {
            departement: newName,
          });
          console.log("Département mis à jour pour le manager :", newDatas.manager);
        }
      }

      await deleteDoc(docRef);
      console.log("Département renommé avec succès !");
    } 
    // Cas 2 : même nom → on regarde si le manager a changé
    else if (datas.manager !== newDatas.manager) {
      // Trouver le nouvel utilisateur manager

      const ancienQ = query(
        collection (db,"Utilisateurs"),
        where("name","==",datas.manager)
      )
      const queryS = await getDocs(ancienQ)
      if(!queryS.empty){
        const ancienManager = queryS.docs[0]
        await updateDoc(doc(db,"Utilisateurs",ancienManager.id),{
          departement: deleteField()
        })
         console.log("ancien manager supprimer",datas.manager)
      }

      const q = query(
        collection(db, "Utilisateurs"),
        where("name", "==", newDatas.manager)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const firstUserDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, "Utilisateurs", firstUserDoc.id), {
          departement: datas.name, // le nom ne change pas
        });
        console.log("Nouveau manager assigné :", newDatas.manager);
      }

      // Mettre à jour le document du département avec le nouveau manager
      await updateDoc(docRef, {
        manager: newDatas.manager,
      });
    }
    // Cas 3 : même nom et même manager → toggle "active"
    else {
      await updateDoc(docRef, {
        active: !docSnapshot.data().active,
      });
      console.log("Statut du l'utilisateur modifié");
    }
  } catch (err) {
    console.log("Erreur lors de l'update :", err);
  }
};


export const DeleteDepartement = async (datas) => {
  try {
    const docRef = doc(db, "Departements", datas.name);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      console.log("Département n'existe pas");
      return;
    }

    // Supprimer toutes les dépenses liées à ce département
    const depensesRef = collection(db, "Depenses");
    const qDepenses = query(depensesRef, where("departement", "==", datas.name));
    const depensesSnapshot = await getDocs(qDepenses);

    console.log("Dépenses trouvées :", depensesSnapshot.docs.length);

    for (const depDoc of depensesSnapshot.docs) {
      await deleteDoc(doc(db, "Depenses", depDoc.id));
      console.log(`Dépense ${depDoc.id} supprimée`);
    }

    const budgetRef = collection(db, "Budgets");
    const qBudget = query(budgetRef, where("departement", "==", datas.name));
    const budgetSnapshot = await getDocs(qBudget);

    console.log("Budgets trouvés :", budgetSnapshot.docs.length);

    for (const budgetDoc of budgetSnapshot.docs) {
      await deleteDoc(doc(db, "Budgets", budgetDoc.id));
      console.log(`Budget ${budgetDoc.id} supprimé`);
    }

    // Retirer le département du manager dans Utilisateurs
    const qUser = query(
      collection(db, "Utilisateurs"),
      where("name", "==", datas.manager)
    );
    const userSnapshot = await getDocs(qUser);

    if (!userSnapshot.empty) {
      const firstUser = userSnapshot.docs[0];
      await updateDoc(doc(db, "Utilisateurs", firstUser.id), {
        departement: deleteField(), 
      });
      console.log("Manager mis à jour, département retiré");
    }

    // Enfin supprimer le département
    await deleteDoc(docRef);
    console.log("Département supprimé !");
  } catch (err) {
    console.log("Erreur lors du delete :", err);
  }
};


export const GetDepartementFManager = async (datas) => {
  try {
    
    const q = query(
      collection(db, "Utilisateurs"),
      where("name", "==", datas.name)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Cette Utilisateurs n'existe pas");
      return null;
    }

    const utilisateurDoc = querySnapshot.docs[0].data();

    return utilisateurDoc.departement;

  } catch (error) {
    console.log('Erreur lors de la récupération du departement d"un manager:', error);
    return null;
  }
};


