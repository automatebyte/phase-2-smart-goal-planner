import { useState, useEffect } from 'react';
import GoalList from './components/GoalList';
import AddGoalForm from './components/AddGoalForm';
import Overview from './components/Overview';
import './App.css';

function App() {
  const [goals, setGoals] = useState([]);

  // Load all goals on startup
  useEffect(() => {
    fetch('http://localhost:3001/goals')
      .then(res => res.json())
      .then(setGoals)
      .catch(err => console.error("Loading failed:", err));
  }, []);

  // Add new goal (handles both financial and non-financial)
  const handleAddGoal = (newGoal) => {
    const goalWithDefaults = {
      ...newGoal,
      createdAt: new Date().toISOString().split('T')[0],
      targetAmount: newGoal.category === 'Finance' ? newGoal.targetAmount : null,
      savedAmount: newGoal.category === 'Finance' ? 0 : null
    };

    fetch('http://localhost:3001/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(goalWithDefaults)
    })
      .then(res => res.json())
      .then(createdGoal => setGoals([...goals, createdGoal]));
  };

  // Delete any goal
  const handleDeleteGoal = (id) => {
    fetch(`http://localhost:3001/goals/${id}`, { method: 'DELETE' })
      .then(() => setGoals(goals.filter(g => g.id !== id)));
  };

  // Deposit only for financial goals
  const handleDeposit = (goalId, amount) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal.targetAmount) return; // Skip non-financial

    const updatedGoal = {
      ...goal,
      savedAmount: goal.savedAmount + Number(amount)
    };

    fetch(`http://localhost:3001/goals/${goalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedAmount: updatedGoal.savedAmount })
    })
      .then(res => res.json())
      .then(updated => {
        setGoals(goals.map(g => g.id === goalId ? updated : g));
      });
  };

  return (
    <div className="goal-app">
      <h1>My Goal Tracker</h1>
      <Overview goals={goals} />
      <AddGoalForm onAddGoal={handleAddGoal} />
      <GoalList
        goals={goals}
        onDelete={handleDeleteGoal}
        onDeposit={handleDeposit}
      />
    </div>
  );
}

export default App;