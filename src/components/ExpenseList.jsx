import { useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";

const ExpenseList = () => {
  const { expenses, deleteExpense } = useContext(BudgetContext);

  return (
    <div className="p-4 border rounded">
      <h2 className="mb-3">Lista de Gastos</h2>
      {expenses.length === 0 ? (
        <p>No hay gastos registrados aún.</p>
      ) : (
        <ul className="list-group">
          {expenses.map((expense) => (
            <li key={expense.id} className="list-group-item d-flex justify-content-between">
              <span>{expense.description}</span>
              <span>${expense.amount.toFixed(2)}</span>
              <span className="text-muted">{expense.user}</span>
              <span className="text-muted">{expense.date}</span>
              <button
                onClick={() => deleteExpense(expense.id)}
                className="btn btn-danger btn-sm"
              >
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ExpenseList; 
