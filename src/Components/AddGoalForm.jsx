import { useState } from 'react';

// Component for adding a new goal
export default function AddGoalForm({ onAddGoal }) {
  // Local state to manage form inputs
  const [newGoal, setNewGoal] = useState({
    name: '',
    description: '',
    category: 'Education',
    deadline: '',
    targetAmount: ''
  });

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation: check if the goal name is entered
    if (!newGoal.name.trim()) {
      alert("Please give your goal a name!");
      return;
    }

    // Create a goal object with extra default properties
    const goalToAdd = {
      ...newGoal,
      targetAmount: newGoal.targetAmount ? Number(newGoal.targetAmount) : null,
      status: 'Not Started' // default status
    };

    // Send the new goal to the parent component
    onAddGoal(goalToAdd);

    // Reset the form after submission
    setNewGoal({
      name: '',
      description: '',
      category: 'Education',
      deadline: '',
      targetAmount: ''
    });
  };

  // Function to handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update state with new input value
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="add-goal-form">
      <h3>Add New Goal</h3>

      {/* Goal name input */}
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

      {/* Description textarea */}
      <label>
        Description:
        <textarea
          name="description"
          value={newGoal.description}
          onChange={handleChange}
          placeholder="More details about your goal..."
        />
      </label>

      {/* Goal category dropdown */}
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

      {/* Deadline input */}
      <label>
        Deadline:
        <input
          type="date"
          name="deadline"
          value={newGoal.deadline}
          onChange={handleChange}
          min={new Date().toISOString().split('T')[0]} // today's date or later
        />
      </label>

      {/* Optional target amount for financial goals */}
      <label>
        Target Amount (for financial goals):
        <input
          type="number"
          name="targetAmount"
          value={newGoal.targetAmount}
          onChange={handleChange}
          placeholder="Leave empty if not financial"
          min="0"
        />
      </label>

      {/* Submit button */}
      <button type="submit">Add Goal</button>
    </form>
  );
}
