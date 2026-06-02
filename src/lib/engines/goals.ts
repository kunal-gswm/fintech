export function calculateGoal(
  goalAmount: number,
  currentSavings: number,
  targetMonths: number
) {
  const remainingAmount = goalAmount - currentSavings;
  const monthlyRequired =
    targetMonths > 0 ? remainingAmount / targetMonths : remainingAmount;

  return {
    monthlyRequired: monthlyRequired > 0 ? monthlyRequired : 0,
    remainingAmount: remainingAmount > 0 ? remainingAmount : 0,
  };
}
