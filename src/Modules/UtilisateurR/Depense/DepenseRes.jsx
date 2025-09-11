import { 
  arrayUnion, 
  collection, 
  doc, 
  getDocs, 
  query, 
  updateDoc, 
  where, 
  addDoc, 
  getDoc
} from "firebase/firestore"
import { auth, db } from "../../firebase/firebase"



export const DepenseFUser = async (datas) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log("Utilisateur non connecté");
      return;
    }

    // 🔹 Récupérer utilisateur
    const qUser = query(
      collection(db, "Utilisateurs"),
      where("email", "==", user.email)
    );
    const getUser = await getDocs(qUser);

    if (getUser.empty) {
      console.log("Utilisateur introuvable pour ce département");
      return;
    }

    const getNomResponsable = getUser.docs[0].data().name;

    // 🔹 Récupérer le département
    const qDepa = query(
      collection(db, "Departements"),
      where("manager", "==", getNomResponsable)
    );
    const getDepartement = await getDocs(qDepa);

    if (getDepartement.empty) {
      console.log("Département introuvable pour ce responsable");
      return;
    }

    const getNomDepa = getDepartement.docs[0].data().name;

    // 🔹 Trouver le budget lié à ce département
    const qBudget = query(
      collection(db, "Budgets"),
      where("departement", "==", getNomDepa)
    );
    const getBudget = await getDocs(qBudget);

    let budgetNom = null;
    let budgetId = null;

    if (!getBudget.empty) {
      const budgetDoc = getBudget.docs[0]; // On prend le premier budget trouvé
      budgetNom = budgetDoc.data().nom || budgetDoc.data().name;
      budgetId = budgetDoc.id;
    } else {
      console.log("⚠️ Aucun budget trouvé pour le département :", getNomDepa);
    }

    // 🔹 Ajouter la dépense dans la collection Depenses
    const depRef = await addDoc(collection(db, "Depenses"), {
      ...datas,
      departement: getNomDepa,
      manager: getNomResponsable,
      budgetId: budgetId || null,   // ✅ lien avec budget
      budget: budgetNom || null,    // ✅ nom du budget
    });

    const depenseAvecId = {
      id: depRef.id,
      ...datas,
      departement: getNomDepa,
      manager: getNomResponsable,
      budgetId: budgetId || null,
      budget: budgetNom || null,
    };

    console.log(" Dépense ajoutée dans Depenses :", depenseAvecId);

    // 🔹 Ajouter aussi chez l'utilisateur
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", datas.email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(" Utilisateur n'existe pas :", datas.email);
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, "Utilisateurs", userDoc.id);

    await updateDoc(userDocRef, {
      expenses: arrayUnion(depenseAvecId),
    });

    console.log(" Dépense ajoutée aussi chez l'utilisateur :", depenseAvecId);
  } catch (err) {
    console.log(" Erreur lors de l'ajout :", err);
  }
};




export const GetDepenseFUser = async (datas) => {
  try {
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", datas.email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(" L'utilisateur n'existe pas");
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, 
      expenses : userDoc.data().expenses || [] 
    };
  } catch (err) {
    console.log(" Erreur lors de la récupération", err);
    return null;
  }
};



export const DeleteDepenseFUser = async (datas,depenseId) => {
  try {
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", datas.email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log(" Utilisateur n'existe pas :", datas.email);
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userDocRef = doc(db, "Utilisateurs", userDoc.id);

    
    const updatedExpenses = (userDoc.data().expenses || []).filter(
      (exp) => exp.id !== depenseId
    );

    await updateDoc(userDocRef, { expenses: updatedExpenses });

    console.log(" Dépense supprimée :", depenseId);
  } catch (err) {
    console.log(" Erreur lors de la suppression :", err);
  }
};



export const GetDepensesFUser = async (datas) => {
  try {
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", datas.email)
    );
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      console.log("L'utilisateur n'existe pas");
      return null;
    }

    const userDoc = querySnapshot.docs[0];
    const allExpenses = userDoc.data().expenses || [];

    
    const sortedExpenses = allExpenses.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    
    const lastFiveExpenses = sortedExpenses.slice(0, 5);

    return { id: userDoc.id, expenses: lastFiveExpenses };
  } catch (err) {
    console.log("Erreur lors de la récupération", err);
    return null;
  }
};

