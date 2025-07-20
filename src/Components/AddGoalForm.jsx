import { useState } from 'react';

// This is the form for adding new goals
export default function AddGoalForm({ onAddGoal }) {
  // Keep track of what the user types
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    category: 'Education',
    deadline: '',
    targetAmount: ''
  });

  // When the form is submitted
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation - make sure name is filled
    if (!newGoal.name.trim()) {
      alert("Please give your goal a name!");
      return;
    }

    // Prepare the goal data
    const goalToAdd = {
      ...newGoal,
      targetAmount: newGoal.targetAmount ? Number(newGoal.targetAmount) : null,
      status: 'Not Started'
    };

    // Send to parent component
    onAddGoal(goalToAdd);

    // Clear the form
    setNewGoal({
      name: '',
      description: '',
      category: 'Education',
      deadline: '',
      targetAmount: ''
    });
  };

  // Update state when inputs change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="add-goal-form">
      <h3>Add New Goal</h3>
      
      <label>
        Goal Name:
        <input
          type="text"
          name="name"
          value={newGoal.name}
          onChange={handleChange}
          placeholder="What do you want to achieve?"
          required
        />
      </label>

      <label>
        Description:
        <textarea
          name="description"
          value={newGoal.description}
          onChange={handleChange}
          placeholder="More details about your goal..."
        />
      </label>

      <label>
        Category:
        <select
          name="category"
          value={newGoal.category}
          onChange={handleChange}
        >
          <option value="Education">Education</option>
          <option value="Finance">Finance</option>
          <option value="Health">Health</option>
          <option value="Career">Career</option>
          <option value="Personal">Personal</option>
        </select>
      </label>

      <label>
        Deadline:
        <input
          type="date"
          name="deadline"
          value={newGoal.deadline}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]}
        />
      </label>

      <label>
        Target Amount (for financial goals):
        <input
          type="number"
          name="targetAmount"
          value={newGoal.targetAmount}
          onChange={handleChange}
          placeholder="Leave empty for non-financial goals"
          min="0"
        />
      </label>

      <button type="submit">Add Goal</button>
    </form>
  );
}