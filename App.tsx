
import React, { useState, useCallback } from 'react';
import { GameState } from './types';
import type { UserProfile, QuizResult } from './types';
import CharacterCreator from './components/CharacterCreator';
import QuizScreen from './components/QuizScreen';
import ResultsScreen from './components/ResultsScreen';
import ProgressDashboard from './components/ProgressDashboard';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.CHARACTER_CREATION);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  const handleStartQuiz = useCallback((profile: UserProfile) => {
    setUserProfile(profile);
    setGameState(GameState.QUIZ);
  }, []);

  const handleQuizComplete = useCallback((results: QuizResult[]) => {
    setQuizResults(results);
    setGameState(GameState.RESULTS);
  }, []);

  const handlePlayAgain = useCallback(() => {
    setUserProfile(null);
    setQuizResults([]);
    setGameState(GameState.CHARACTER_CREATION);
  }, []);

  const handleViewProgress = useCallback(() => {
    setGameState(GameState.PROGRESS_DASHBOARD);
  }, []);

  const handleBackToCreator = useCallback(() => {
    setGameState(GameState.CHARACTER_CREATION);
  }, []);


  const renderGameState = () => {
    switch (gameState) {
      case GameState.CHARACTER_CREATION:
        return <CharacterCreator onStartQuiz={handleStartQuiz} onViewProgress={handleViewProgress} />;
      case GameState.QUIZ:
        if (!userProfile) return null;
        return <QuizScreen userProfile={userProfile} onQuizComplete={handleQuizComplete} />;
      case GameState.RESULTS:
        if (!userProfile) return null;
        return <ResultsScreen userProfile={userProfile} results={quizResults} onPlayAgain={handlePlayAgain} />;
      case GameState.PROGRESS_DASHBOARD:
        return <ProgressDashboard onBack={handleBackToCreator} />;
      default:
        return <CharacterCreator onStartQuiz={handleStartQuiz} onViewProgress={handleViewProgress} />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-800 text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        {renderGameState()}
      </div>
    </div>
  );
};

export default App;
