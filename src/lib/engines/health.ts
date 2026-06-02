export function calculateHealthScore(
  monthlyIncome: number,
  monthlyExpenses: number,
  totalEmergencySavings: number,
  totalGoalProgress: number
) {
  // 1. Savings Rate
  let savingsRate = 0;
  if (monthlyIncome > 0) {
    savingsRate = (monthlyIncome - monthlyExpenses) / monthlyIncome;
  } else if (monthlyExpenses > 0) {
    savingsRate = -1; // Negative savings rate
  }
  
  let savingsScore = 0;
  if (savingsRate >= 0.2) savingsScore = 40;
  else if (savingsRate >= 0.1) savingsScore = 20;
  else if (savingsRate > 0) savingsScore = 10;

  // 2. Emergency Fund (assuming 6 months of expenses is ideal)
  const idealEmergencyFund = monthlyExpenses * 6;
  const emergencyRatio = totalEmergencySavings / idealEmergencyFund;
  let emergencyScore = 0;
  if (emergencyRatio >= 1) emergencyScore = 40;
  else if (emergencyRatio >= 0.5) emergencyScore = 20;
  else if (emergencyRatio > 0) emergencyScore = 10;

  // 3. Goal Progress (simple bonus score up to 20)
  const goalScore = Math.min(20, Math.floor(totalGoalProgress * 20));

  const totalScore = Math.min(100, savingsScore + emergencyScore + goalScore);

  let riskLevel = "High";
  if (totalScore >= 80) riskLevel = "Low";
  else if (totalScore >= 50) riskLevel = "Moderate";

  return {
    score: totalScore,
    riskLevel,
    details: {
      savingsRate,
      savingsScore,
      emergencyMonths: monthlyExpenses > 0 ? totalEmergencySavings / monthlyExpenses : 0,
      emergencyScore,
      goalProgress: totalGoalProgress,
      goalScore
    }
  };
}
