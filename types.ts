export enum GameState {
  CHARACTER_CREATION = 'CHARACTER_CREATION',
  QUIZ = 'QUIZ',
  RESULTS = 'RESULTS',
  PROGRESS_DASHBOARD = 'PROGRESS_DASHBOARD',
}

export interface CharacterOptions {
  skinColor: string;
  hairStyle: string;
  hairColor: string;
  shirtColor: string;
  pantsColor: string;
  shoesColor: string;
}

export interface UserProfile {
  name: string;
  grade: string;
  subject: string;
  character: CharacterOptions;
}

export interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  visual?: string;
}

export interface QuizResult {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  neededHelp: boolean;
}

export interface QuizSession {
  date: string;
  grade: string;
  subject: string;
  score: number;
  results: QuizResult[];
}
