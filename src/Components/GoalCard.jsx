// GoalCard.jsx - Component to display each individual goal card
import { useState } from 'react';

export default function GoalCard({ goal, onDelete, onDeposit }) {
  const [amount, setAmount] = useState('');

  // Calculate the number of days left until the deadline
  const daysLeft = Math.ceil(
    (new Date(goal.deadline) - new Date()) / (1000 * 60 * 60 * 24)
  );

  // Flags for urgency
  const isAlmostDue = daysLeft <= 30 && goal.status !== 'Completed'; // If 30 days or less remaining
  const isOverdue = daysLeft < 0 && goal.status !== 'Completed'; // If date has passed

  // Handles money deposit to savings goal
  const handleAddMoney = (e) => {
    e.preventDefault();
    if (amount && goal.targetAmount) {
      onDeposit(goal.id, Number(amount)); // Trigger deposit callback from parent
      setAmount(''); // Clear input
    }
  };

  return (
    <div className={`goal-card ${isOverdue ? 'urgent' : ''}`}>
      {/* Title and category */}
      <h3>{goal.name}</h3>
      <p className="category">{goal.category}</p>
      <p className="description">{goal.description}</p>

      {/* Financial goal progress section */}
      {goal.targetAmount && (
        <div className="money-section">
          <div className="progress-bar">
            <div
              className="progress"
              style={{
                width: `${(goal.savedAmount / goal.targetAmount) * 100}%`,
              }}
            ></div>
          </div>
          <p className="money-tracker">
            Saved: <strong>${goal.savedAmount}</strong> of ${goal.targetAmount}
          </p>
        </div>
      )}

      {/* Deadline and urgency message */}
      <p className="due-date">
        <strong>Due:</strong> {goal.deadline}{' '}
        {isAlmostDue && <span className="almost-due"> - Hurry up!</span>}
        {isOverdue && <span className="overdue"> - Late!</span>}
      </p>

      {/* Form to add money (only for savings goals) */}
      {goal.targetAmount && (
        <form onSubmit={handleAddMoney} className="deposit-form">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
          />
          <button type="submit" className="deposit-btn">Add</button>
        </form>
      )}

      {/* Delete goal button */}
      <button onClick={() => onDelete(goal.id)} className="delete-button">
        × Delete
      </button>
    </div>
  );
}

