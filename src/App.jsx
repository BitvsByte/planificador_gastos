import { useContext } from "react";
import { BudgetContext } from "./context/BudgetContext";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";

function App() {
  const { budget, expenses, closeDay } = useContext(BudgetContext);

  const dailyBudget = budget?.dailyBudget || 0;
  const totalSpent = expenses.reduce((sum, expense) => sum + (expense.amount || 0), 0);
  const remainingBudget = dailyBudget - totalSpent;

  return (
    <>
    <div className="p-5">
      <div className="p-4 border rounded mb-4">
        <h2>Presupuesto Inicial: ${dailyBudget.toFixed(2)}</h2>
        <h2>Total Gastado: ${totalSpent.toFixed(2)}</h2>
        <h2
          className={`text-${remainingBudget >= 0 ? "success" : "danger"}`}
          >
          Saldo Restante: ${Math.abs(remainingBudget).toFixed(2)}
        </h2>
        <button onClick={closeDay} className="btn btn-warning mt-3">
          Cerrar Día
        </button>
      </div>
      <ExpenseForm />
      <ExpenseList />
    </div>
    </>
  );
}

export default App;



