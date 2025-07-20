// Overview.jsx - Displays a summary of user's goal progress

export default function Overview({ goals }) {
  // Total number of goals
  const totalGoals = goals.length;

  // Number of goals that are completed
  const completedGoals = goals.filter(g => g.status === 'Completed').length;

  // Number of goals currently in progress
  const inProgressGoals = goals.filter(g => g.status === 'In Progress').length;

  // Filter goals that have a targetAmount (these are financial goals)
  const financialGoals = goals.filter(g => g.targetAmount !== null);

  // Total amount saved so far from all financial goals
  const totalSaved = financialGoals.reduce((sum, goal) => sum + (goal.savedAmount || 0), 0);

  // Total target amount from all financial goals
  const totalTarget = financialGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  // Calculate progress as a percentage
  const progressPercentage = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="overview">
      <h2>Your Progress</h2>

      {/* Display goal statistics in a grid layout */}
      <div className="stats-grid">

        {/* Total number of goals */}
        <div className="stat-card">
          <h3>{totalGoals}</h3>
          <p>Total Goals</p>
        </div>

        {/* Number of completed goals */}
        <div className="stat-card completed">
          <h3>{completedGoals}</h3>
          <p>Completed</p>
        </div>

        {/* Number of goals still in progress */}
        <div className="stat-card in-progress">
          <h3>{inProgressGoals}</h3>
          <p>In Progress</p>
        </div>

        {/* Display financial goal savings if they exist */}
        {financialGoals.length > 0 && (
          <div className="stat-card money">
            <h3>${totalSaved}</h3>
            <p>Saved of ${totalTarget}</p>

            {/* Small progress bar for financial goal progress */}
            <div className="mini-progress">
              <div
                className="mini-progress-bar"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
