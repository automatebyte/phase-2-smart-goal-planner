// Overview.jsx - Shows goal summary statistics
export default function Overview({ goals }) {
  // Calculate totals
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.status === 'Completed').length;
  const inProgressGoals = goals.filter(g => g.status === 'In Progress').length;

  // Calculate financial totals (only for money goals)
  const financialGoals = goals.filter(g => g.targetAmount !== null);
  const totalSaved = financialGoals.reduce((sum, goal) => sum + goal.savedAmount, 0);
  const totalTarget = financialGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  return (
    <div className="overview">
      <h2>Your Progress</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{totalGoals}</h3>
          <p>Total Goals</p>
        </div>

        <div className="stat-card completed">
          <h3>{completedGoals}</h3>
          <p>Completed</p>
        </div>

        <div className="stat-card in-progress">
          <h3>{inProgressGoals}</h3>
          <p>In Progress</p>
        </div>

        {financialGoals.length > 0 && (
          <div className="stat-card money">
            <h3>${totalSaved}</h3>
            <p>Saved of ${totalTarget}</p>
            <div className="mini-progress">
              <div style={{ width: `${(totalSaved/totalTarget)*100}%` }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}