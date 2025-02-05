import { useState, useContext } from "react";
import { BudgetContext } from "../context/BudgetContext"; // Usamos el contexto global

const ExpenseForm = () => {
  const { budget, addExpense } = useContext(BudgetContext); // Consumimos addExpense desde el contexto
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState(budget.users[0]?.name || ""); // Selecciona el primer usuario por defecto
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Fecha actual

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description || !amount || !user || !date) return;

    // Llamar a la función addExpense del contexto
    await addExpense(description, amount, user, date);

    // Resetear el formulario
    setDescription("");
    setAmount("");
    setDate(new Date().toISOString().split("T")[0]); // Reiniciar la fecha al día actual
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded mb-4">
      <h2 className="mb-3">Agregar Gasto</h2>
      <div className="mb-3">
        <label className="form-label">Descripción</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-control"
          placeholder="Ej. Cena en restaurante"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Cantidad</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="form-control"
          placeholder="Ej. 50"
          required
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Usuario</label>
        <select
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="form-select"
          required
        >
          {budget.users.map((user, index) => (
            <option key={index} value={user.name}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">Fecha</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Agregar
      </button>
    </form>
  );
};

export default ExpenseForm;
