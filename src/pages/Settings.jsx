import { useState, useContext } from "react";
import { BudgetContext } from "../context/BudgetContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const Settings = () => {
  const { budget, setBudget } = useContext(BudgetContext);

  // Estados locales
  const [startDate, setStartDate] = useState(budget.startDate || "");
  const [endDate, setEndDate] = useState(budget.endDate || "");
  const [dailyBudget, setDailyBudget] = useState(budget.dailyBudget || 200);
  const [users, setUsers] = useState(
    budget.users.length > 0
      ? budget.users
      : [
          { name: "Usuario 1", color: "#3498db" },
          { name: "Usuario 2", color: "#9b59b6" },
        ]
  );

  // Manejar cambios en los usuarios
  const handleUserChange = (index, field, value) => {
    const updatedUsers = [...users];
    updatedUsers[index][field] = value;
    setUsers(updatedUsers);
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newConfig = {
      dailyBudget: parseFloat(dailyBudget),
      startDate,
      endDate,
      users,
    };

    // Guardar configuración en el contexto global
    setBudget(newConfig);

    // Guardar configuración en Firestore
    try {
      await setDoc(doc(db, "settings", "config"), newConfig);
      console.log("Configuración guardada en Firestore:", newConfig);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="mb-4">Configurar el Viaje</h2>
      <form onSubmit={handleSubmit} className="p-4 border rounded">
        <div className="mb-3">
          <label className="form-label">Fecha de Inicio</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Fin</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Presupuesto Diario</label>
          <input
            type="number"
            value={dailyBudget}
            onChange={(e) => setDailyBudget(e.target.value)}
            className="form-control"
            required
          />
        </div>
        <h3 className="mb-3">Usuarios</h3>
        {users.map((user, index) => (
          <div key={index} className="mb-3 d-flex gap-3 align-items-center">
            <input
              type="text"
              value={user.name}
              onChange={(e) => handleUserChange(index, "name", e.target.value)}
              className="form-control"
              placeholder={`Usuario ${index + 1}`}
              required
            />
            <input
              type="color"
              value={user.color}
              onChange={(e) => handleUserChange(index, "color", e.target.value)}
              className="form-control-color"
              required
            />
          </div>
        ))}
        <button type="submit" className="btn btn-success">
          Guardar Configuración
        </button>
      </form>
    </div>
  );
};

export default Settings;
