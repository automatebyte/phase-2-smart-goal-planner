// Import the stuff we need
import { useState, useEffect } from 'react';
import GoalList from './components/GoalList';
import AddGoalForm from './components/AddGoalForm';
import Overview from './components/Overview';
import './App.css'; // Our styles

function App() {
  // This is where we keep our goals
  const [goals, setGoals] = useState([]);

  // When the app starts, load the goals
  useEffect(() => {
    console.log("Loading goals...");
    fetch('http://localhost:3001/goals')
      .then(response => {
        if (!response.ok) throw new Error("Oops, couldn't load goals!");
        return response.json();
      })
      .then(data => {
        console.log("Got goals:", data);
        setGoals(data);
      })
      .catch(error => {
        console.error("Something went wrong:", error);
      });
  }, []);

  // Add a new goal (like when you submit the form)
  const addNewGoal = (goalData) => {
    console.log("Adding new goal:", goalData);
    
    // Fix the data before sending
    const completeGoal = {
      ...goalData,
      createdAt: new Date().toLocaleDateString(), // Add today's date
      savedAmount: goalData.category === 'Finance' ? 0 : null // Money stuff
    };

    fetch('http://localhost:3001/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(completeGoal)
    })
      .then(res => res.json())
      .then(newGoal => {
        console.log("Server says:", newGoal);
        setGoals([...goals, newGoal]); // Add to our list
      });
  };

  // Delete a goal (when you click the X button)
  const deleteGoal = (goalId) => {
    console.log("Deleting goal", goalId);
    
    fetch(`http://localhost:3001/goals/${goalId}`, {
      method: 'DELETE'
    })
      .then(() => {
        // Remove it from our list
        setGoals(goals.filter(g => g.id !== goalId));
        console.log("Poof! It's gone!");
      });
  };

  // Add money to a savings goal
  const addToSavings = (goalId, amount) => {
    console.log(`Adding $${amount} to goal ${goalId}`);
    
    const goal = goals.find(g => g.id === goalId);
    if (!goal || !goal.targetAmount) {
      console.log("This isn't a money goal!");
      return;
    }

    const updatedAmount = goal.savedAmount + Number(amount);
    
    fetch(`http://localhost:3001/goals/${goalId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ savedAmount: updatedAmount })
    })
      .then(res => res.json())
      .then(updatedGoal => {
        // Update just this goal
        setGoals(goals.map(g => 
          g.id === goalId ? updatedGoal : g
        ));
        console.log("Money added!");
      });
  };

  // This is what shows up on screen
  return (
    <div className="app">
      <header>
        <h1>My Goal Tracker </h1>
        <p>Keep track of what matters</p>
      </header>

      <main>
        {/* Show quick stats */}
        <Overview goals={goals} />

        {/* Form to add new goals */}
        <AddGoalForm onAddGoal={addNewGoal} />

        {/* The big list of goals */}
        <GoalList
          goals={goals}
          onDelete={deleteGoal}
          onDeposit={addToSavings}
        />
      </main>

      <footer>
        <p>Made with React</p>
      </footer>
    </div>
  );
}

export default App;