// Import all the necessary tools and components
import { useState, useEffect } from 'react'; // React hooks for state and side effects
import GoalList from './Components/GoalList'; // Component to display all goals
import AddGoalForm from './Components/AddGoalForm'; // Form to add new goals
import Overview from './Components/Overview'; // Summary statistics component
import './App.css'; // Our styling file

function App() {
  // State to store our list of goals
  const [goals, setGoals] = useState([]);
  // State to track if data is loading
  const [isLoading, setIsLoading] = useState(true);
  // State to store any error messages
  const [error, setError] = useState(null);

  // This runs when the component first loads
  useEffect(() => {
    const fetchGoals = async () => {
      setIsLoading(true); // Show loading state
      try {
        // Try to get goals from our server
        const response = await fetch('http://localhost:3001/goals');
        
        // If response isn't okay, throw an error
        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }
        
        // Convert response to JSON
        const data = await response.json();
        setGoals(data); // Update our goals state
      } catch (err) {
        // If anything goes wrong, catch the error
        setError(err.message); // Store error message
        console.error('Error:', err);
      } finally {
        // Whether successful or not, stop loading
        setIsLoading(false);
      }
    };

    fetchGoals(); // Call our async function
  }, []); // Empty array means this runs only once on mount

  // Function to add a new goal
  const addNewGoal = async (goalData) => {
    try {
      // Prepare the complete goal data
      const completeGoal = {
        ...goalData,
        createdAt: new Date().toISOString(), // Add creation timestamp
        savedAmount: goalData.category === 'Finance' ? 0 : null, // Set initial savings
        status: 'Not Started' // Default status
      };

      // Send the new goal to our server
      const response = await fetch('http://localhost:3001/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(completeGoal)
      });

      // Get the newly created goal from response
      const newGoal = await response.json();
      
      // Update our state with the new goal
      setGoals([...goals, newGoal]);
    } catch (err) {
      // Handle any errors
      setError('Failed to add goal');
      console.error('Error:', err);
    }
  };

  // Function to delete a goal
  const deleteGoal = async (goalId) => {
    try {
      // Tell server to delete this goal
      await fetch(`http://localhost:3001/goals/${goalId}`, {
        method: 'DELETE'
      });
      
      // Remove the goal from our state
      setGoals(goals.filter(goal => goal.id !== goalId));
    } catch (err) {
      // Handle any errors
      setError('Failed to delete goal');
      console.error('Error:', err);
    }
  };

  // Function to add money to a savings goal
  const addToSavings = async (goalId, amount) => {
    try {
      // Find the goal we're updating
      const goal = goals.find(g => g.id === goalId);
      
      // Only proceed if it's a financial goal
      if (goal && goal.targetAmount !== null) {
        // Calculate new saved amount
        const updatedAmount = goal.savedAmount + Number(amount);
        
        // Update the goal on the server
        const response = await fetch(`http://localhost:3001/goals/${goalId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ savedAmount: updatedAmount })
        });

        // Get the updated goal from response
        const updatedGoal = await response.json();
        
        // Update our state with the changed goal
        setGoals(goals.map(g => g.id === goalId ? updatedGoal : g));
      }
    } catch (err) {
      // Handle any errors
      setError('Failed to add to savings');
      console.error('Error:', err);
    }
  };

  // This is what gets displayed on the screen
  return (
    <div className="app">
      {/* Header section */}
      <header>
        <h1>My Goal Tracker </h1>
        <p>Track your progress and achieve more</p>
      </header>

      {/* Main content area */}
      <main>
        {/* Show any errors that occurred */}
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}

        {/* Overview statistics */}
        <Overview goals={goals} />

        {/* Form to add new goals */}
        <AddGoalForm onAddGoal={addNewGoal} />

        {/* Show loading message or goal list */}
        {isLoading ? (
          <div className="loading">Loading your goals...</div>
        ) : (
          <GoalList
            goals={goals}
            onDelete={deleteGoal}
            onDeposit={addToSavings}
          />
        )}
      </main>

      {/* Footer */}
      <footer>
        <p>Made with  using React</p>
      </footer>
    </div>
  );
}

export default App;