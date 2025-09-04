
import React, { useEffect, useMemo, useState } from "react";
import { AppContext } from "./AppContext"; 
import { auth } from "../../Modules/firebase/firebase";

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [reports, setReports] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [currentUser,setCurrentUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          email: user.email,
          displayName: localStorage.getItem("username") || user.email.split("@")[0],
          uid: user.uid
        });
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const value = useMemo(
    () => ({
      users,
      setUsers,
      departments,
      setDepartments,
      budgets,
      setBudgets,
      reports,
      setReports,
      expenses,
      setExpenses,
      currentUser,
      setCurrentUser
    }),
    [users, departments, budgets, reports, expenses,currentUser]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
