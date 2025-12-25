export function calculateScore(
  totalProblems: number,
  currentStreak: number,
  totalTimeMinutes: number,
  easyCount: number = 0,
  mediumCount: number = 0,
  hardCount: number = 0
): number {
  const problemScore = easyCount * 10 + mediumCount * 25 + hardCount * 50;

  const streakBonus = currentStreak * 5;

  const timeBonus = Math.min(Math.floor(totalTimeMinutes / 30), 100);

  const consistencyBonus = currentStreak >= 7 ? 50 : currentStreak >= 3 ? 25 : 0;

  return problemScore + streakBonus + timeBonus + consistencyBonus;
}

export function updateUserRank(profiles: Array<{ id: string; score: number }>) {
  const sorted = [...profiles].sort((a, b) => b.score - a.score);
  return sorted.map((profile, index) => ({
    ...profile,
    rank: index + 1,
  }));
}
