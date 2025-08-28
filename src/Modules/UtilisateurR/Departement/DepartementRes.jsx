
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";

export const GetDepartementFUser = async (datas) => {
  try {
    const q = query(
      collection(db, "Utilisateurs"),
      where("email", "==", datas.email)
    );

    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.log("L'utilisateur n'existe pas");
      return [];
    }

    const userDoc = querySnapshot.docs[0];
    return userDoc.data().departement || [];
  } catch (err) {
    console.log("Erreur lors de la récupération du département :", err);
    return [];
  }
};
