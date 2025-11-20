import type { QuizSession } from '../types';

const PROGRESS_KEY = 'minecraftMathQuestProgress';

export const saveQuizSession = (session: QuizSession): void => {
  try {
    const history = getQuizHistory();
    // Add the most recent session to the beginning of the array
    history.unshift(session);
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(history));
  // FIX: Corrected a syntax error in the catch block. `catch` does not use arrow function syntax.
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
};

export const getQuizHistory = (): QuizSession[] => {
  try {
    const historyJSON = localStorage.getItem(PROGRESS_KEY);
    return historyJSON ? JSON.parse(historyJSON) : [];
  } catch (error) {
    console.error("Failed to retrieve progress:", error);
    return [];
  }
};