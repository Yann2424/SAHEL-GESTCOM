
import React, { useMemo, useState } from "react";
import { AppContext } from "../Administrateur/AppContext"; 

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [reports, setReports] = useState([]);
  const [expenses, setExpenses] = useState([]);

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
    }),
    [users, departments, budgets, reports, expenses]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
