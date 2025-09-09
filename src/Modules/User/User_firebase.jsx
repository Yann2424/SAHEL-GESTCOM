import { collection, deleteDoc, doc, getDoc, getDocs, setDoc, updateDoc, where, query } from 'firebase/firestore'
import { auth, db } from '../firebase/firebase'
import { updateEmail, createUserWithEmailAndPassword, sendPasswordResetEmail} from 'firebase/auth'

const generatePassword = (length = 7) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// export const NewUser = async (datas) => {
//   try {
//     const password = generatePassword()
//     const userCredential = await createUserWithEmailAndPassword(
//       auth,
//       datas.email,
//       password
//     );

//     const user = userCredential.user;
//     console.log("Utilisateur créé dans Auth:", user.uid);

    
//     const docRef = doc(db, "Utilisateurs", datas.email);
//     const docSnapshot = await getDoc(docRef);

//     if (docSnapshot.exists()) {
//       console.log("Utilisateur existe déjà dans Firestore !");
//       return;
//     }

//     await setDoc(docRef, {
//       ...datas,
//       password: password,
//       role:datas.role || "Responsable",
//       createdAt : new Date()
//     });

//     console.log("Utilisateur ajouté dans Firestore !");
//   } catch (err) {
//     console.log("Erreur lors de la création de l'utilisateur:", err);
//   }
// };



export const NewUser = async (datas) => {
  try {
    // Mot de passe temporaire généré (inutile pour l'utilisateur)
    const tempPassword = Math.random().toString(36).slice(-8);

    // 🔹 Création de l'utilisateur dans Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      datas.email,
      tempPassword
    );
    const user = userCredential.user;
    console.log("Utilisateur créé dans Auth :", user.uid);

    // 🔹 Vérifie si l'utilisateur existe déjà dans Firestore
    const docRef = doc(db, "Utilisateurs", datas.email);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      console.log("Utilisateur existe déjà dans Firestore !");
      return;
    }

    // 🔹 Ajouter l'utilisateur dans Firestore sans mot de passe
    await setDoc(docRef, {
      ...datas,
      role: datas.role || "Responsable",
      createdAt: new Date(),
      password: null, // on ne stocke pas le mot de passe
    });
    console.log("Utilisateur ajouté dans Firestore !");

    // 🔹 Envoyer email pour que l'utilisateur crée son mot de passe
    await sendPasswordResetEmail(auth, datas.email);
    console.log(`Email envoyé à ${datas.email} pour créer son mot de passe`);

  } catch (err) {
    console.log("Erreur lors de la création de l'utilisateur :", err);
  }
};

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

export const UpdateUser = async (datas, newDatas) => {
  try {
    if (!datas?.email) {
      console.error("Ancien email invalide:", datas);
      return;
    }

    const docRef = doc(db, "Utilisateurs", datas.email);
    const docSnapshot = await getDoc(docRef);

    if (!docSnapshot.exists()) {
      console.log("Cet utilisateur n'existe pas");
      return;
    }

    const oldData = docSnapshot.data();

    
    if (datas.email !== newDatas.email) {
      const currentUser = auth.currentUser

      if (currentUser && currentUser.email === datas.email) {
        await updateEmail(currentUser, newDatas.email);
        console.log("Email mis à jour dans Firebase Auth !");
      } else {
        console.log("Impossible de mettre à jour l'email Auth : utilisateur non connecté");
      }

      
      const newDocRef = doc(db, "Utilisateurs", newDatas.email);
      await setDoc(newDocRef, { ...oldData, ...newDatas });
      await deleteDoc(docRef);

      console.log("Utilisateur déplacé dans Firestore avec le nouvel email !");
    } else {
      
      await updateDoc(docRef, newDatas);
      console.log("Utilisateur mis à jour dans Firestore !");
    }
  } catch (err) {
    console.log("Erreur lors de la mise à jour :", err);
  }
};


export const GetManagerFDepartement = async (datas) => {
  try {
    
    const q = query(
      collection(db, "Departements"),
      where("name", "==", datas.name)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("Ce département n'existe pas");
      return null;
    }

    const departementDoc = querySnapshot.docs[0].data();

    return departementDoc.manager;

  } catch (error) {
    console.log('Erreur lors de la récupération du manager:', error);
    return null;
  }
};
