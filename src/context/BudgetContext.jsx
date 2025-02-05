import { createContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { 
  collection, 
  addDoc, 
  query, 
  onSnapshot, 
  doc, 
  getDoc, 
  deleteDoc, 
  updateDoc 
} from "firebase/firestore";
import { db } from "../firebaseConfig";

export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const [budget, setBudget] = useState({
    dailyBudget: 200,
    startDate: "",
    endDate: "",
    users: [],
  });

  const [expenses, setExpenses] = useState([]);

  // Función para agregar un gasto a Firestore
  const addExpense = async (description, amount, user, date) => {
    try {
      const newExpense = {
        description,
        amount: parseFloat(amount),
        user,
        date,
        createdAt: new Date(),
      };
      await addDoc(collection(db, "expenses"), newExpense);
      console.log("Gasto agregado a Firestore");
    } catch (error) {
      console.error("Error al agregar gasto:", error);
    }
  };

  // Función para eliminar un gasto de Firestore
  const deleteExpense = async (id) => {
    try {
      await deleteDoc(doc(db, "expenses", id));
      console.log(`Gasto con ID ${id} eliminado de Firestore.`);
    } catch (error) {
      console.error("Error al eliminar gasto:", error);
    }
  };

  // Función para cerrar el día y calcular el presupuesto para el siguiente día
  const closeDay = async () => {
    try {
      // Calcular el total gastado y el saldo restante
      const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      const remainingBudget = budget.dailyBudget - totalSpent;

      // Actualizar el presupuesto del día siguiente
      const newDailyBudget = budget.dailyBudget + remainingBudget;

      // Guardar el nuevo presupuesto en Firestore
      const configRef = doc(db, "settings", "config");
      await updateDoc(configRef, { dailyBudget: newDailyBudget });

      // Actualizar el estado local
      setBudget((prev) => ({
        ...prev,
        dailyBudget: newDailyBudget,
      }));

      // Eliminar los gastos del día actual
      const batch = db.batch();
      expenses.forEach((expense) => {
        const expenseRef = doc(db, "expenses", expense.id);
        batch.delete(expenseRef);
      });
      await batch.commit();

      console.log("Día cerrado, presupuesto actualizado, gastos eliminados.");
    } catch (error) {
      console.error("Error al cerrar el día:", error);
    }
  };

  // Escuchar cambios en los gastos en Firestore
  useEffect(() => {
    const q = query(collection(db, "expenses"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const expensesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setExpenses(expensesData);
      console.log("Gastos actualizados desde Firestore:", expensesData);
    });

    return () => unsubscribe(); // Limpiar el listener
  }, []);

  // Cargar configuración inicial desde Firestore
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const docRef = doc(db, "settings", "config");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setBudget(docSnap.data());
          console.log("Configuración cargada desde Firestore:", docSnap.data());
        }
      } catch (error) {
        console.error("Error al cargar configuración:", error);
      }
    };

    fetchConfig();
  }, []);

  return (
    <BudgetContext.Provider
      value={{
        budget,
        setBudget,
        expenses,
        setExpenses,
        addExpense,
        deleteExpense,
        closeDay, // Añadimos la función para cerrar el día
      }}
    >
      {children}
    </BudgetContext.Provider>
  );
};

BudgetProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
