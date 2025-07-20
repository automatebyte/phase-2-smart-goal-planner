import GoalCard from './GoalCard';

// This shows all your goals in a nice list
export default function GoalList({ goals, onDelete, onDeposit }) {
  return (
    <div className="goals-list">
      <h2>My Goals</h2>
      
      {goals.length === 0 ? (
        <p>Whoops, no goals yet! Click 'Add Goal' to start.</p>
      ) : (
        goals.map(goal => (
          <GoalCard
            key={goal.id} // This helps React keep track
            goal={goal}
            onDelete={onDelete}
            onDeposit={onDeposit}
          />
        ))
      )}
    </div>
  );
}