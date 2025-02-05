import { useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";

const DailyHistory = () => {
  const { expenses } = useContext(BudgetContext);

  // Agrupar gastos por fecha
  const groupedExpenses = expenses.reduce((acc, expense) => {
    const date = expense.date || "Sin fecha";
    if (!acc[date]) acc[date] = [];
    acc[date].push(expense);
    return acc;
  }, {});

  return (
    <div className="p-4 border rounded mt-5">
      <h2 className="mb-4">Historial por Días</h2>
      {Object.entries(groupedExpenses).map(([date, expenses]) => (
        <div key={date} className="mb-4">
          <h3 className="fw-bold">{date}</h3>
          <ul className="list-group">
            {expenses.map((expense) => (
              <li
                key={expense.id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <span>{expense.description}</span>
                <span className="badge bg-primary">${expense.amount.toFixed(2)}</span>
                <span className="text-muted">({expense.user})</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default DailyHistory;