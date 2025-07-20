import { useState } from 'react';

// This shows one single goal card
export default function GoalCard({ goal, onDelete, onDeposit }) {
  const [amount, setAmount] = useState('');

  // Figure out if the goal is almost due
  const daysLeft = Math.ceil(
    (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );
  const isAlmostDue = daysLeft <= 30 && goal.status !== 'Completed';
  const isOverdue = daysLeft < 0 && goal.status !== 'Completed';

  // Handle adding money to savings goals
  const handleAddMoney = (e) => {
    e.preventDefault();
    if (amount && goal.targetAmount) {
      onDeposit(goal.id, amount);
      setAmount('');
    }
  };

  return (
    <div className={`goal-card ${isOverdue ? 'urgent' : ''}`}>
      <h3>{goal.name}</h3>
      <p className="category">{goal.category}</p>
      <p>{goal.description}</p>

      {/* Show progress for money goals */}
      {goal.targetAmount && (
        <div className="money-stuff">
          <div className="progress-bar">
            <div 
              className="progress" 
              style={{ width: `${(goal.savedAmount / goal.targetAmount) * 100}%` }}
            ></div>
          </div>
          <p>Saved: ${goal.savedAmount} of ${goal.targetAmount}</p>
        </div>
      )}

      {/* Deadline info */}
      <p className="due-date">
        Due: {goal.deadline}
        {isAlmostDue && ' - Hurry up!'}
        {isOverdue && ' - Late!'}
      </p>

      {/* Add money form for savings goals */}
      {goal.targetAmount && (
        <form onSubmit={handleAddMoney}>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="How much to add?"
          />
          <button type="submit">Add</button>
        </form>
      )}

      <button 
        onClick={() => onDelete(goal.id)}
        className="delete-button"
      >
        × Delete
      </button>
    </div>
  );
}