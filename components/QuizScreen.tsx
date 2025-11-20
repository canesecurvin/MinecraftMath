import React, { useState, useEffect, useCallback, useRef } from 'react';
import { generateQuizQuestions, getHintForQuestion } from '../services/geminiService';
import type { UserProfile, QuizQuestion, QuizResult } from '../types';
import CoinIcon from './icons/CoinIcon';
import MinecraftButton from './MinecraftButton';

const HELP_TIMER_SECONDS = 120;

interface QuizScreenProps {
  userProfile: UserProfile;
  onQuizComplete: (results: QuizResult[]) => void;
}

const QuizScreen: React.FC<QuizScreenProps> = ({ userProfile, onQuizComplete }) => {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showHelpPrompt, setShowHelpPrompt] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [neededHelp, setNeededHelp] = useState(false);

  const helpTimerRef = useRef<number | null>(null);

  const resetHelpTimer = useCallback(() => {
    if (helpTimerRef.current) {
      clearTimeout(helpTimerRef.current);
    }
    helpTimerRef.current = window.setTimeout(() => {
      setShowHelpPrompt(true);
    }, HELP_TIMER_SECONDS * 1000);
  }, []);
  
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    const fetchedQuestions = await generateQuizQuestions(userProfile.grade, userProfile.subject);
    setQuestions(fetchedQuestions);
    setIsLoading(false);
    resetHelpTimer();
  }, [userProfile.grade, userProfile.subject, resetHelpTimer]);

  useEffect(() => {
    fetchQuestions();
    return () => {
      if (helpTimerRef.current) clearTimeout(helpTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = (answerKey: 'A' | 'B' | 'C' | 'D') => {
    if (isAnswered) return;
    if (helpTimerRef.current) clearTimeout(helpTimerRef.current);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answerKey === currentQuestion.correctAnswer;

    setSelectedAnswer(answerKey);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(prev => prev + 10);
    }

    const result: QuizResult = {
      question: currentQuestion.question,
      userAnswer: currentQuestion.options[answerKey],
      correctAnswer: currentQuestion.options[currentQuestion.correctAnswer],
      isCorrect,
      neededHelp,
    };
    setResults(prev => [...prev, result]);

    setTimeout(() => {
      goToNextQuestion();
    }, 2000);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setShowHelpPrompt(false);
      setHint(null);
      setNeededHelp(false);
      resetHelpTimer();
    } else {
      onQuizComplete(results);
    }
  };
  
  const handleGetHint = async () => {
    const currentQuestion = questions[currentQuestionIndex];
    setShowHelpPrompt(false);
    setNeededHelp(true);
    const fetchedHint = await getHintForQuestion(currentQuestion.question);
    setHint(fetchedHint);
  };
  
  if (isLoading) {
    return <div className="text-center text-3xl animate-pulse">Forging questions in the mines...</div>;
  }

  if (questions.length === 0) {
    return <div className="text-center text-3xl text-red-400">Could not retrieve questions. Please try again.</div>;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-stone-700/80 p-6 md:p-8 border-4 border-t-stone-500 border-l-stone-500 border-b-stone-900 border-r-stone-900">
      <div className="flex justify-between items-center mb-4">
        <div className="text-xl">{userProfile.name}'s Quest</div>
        <div className="flex items-center text-2xl bg-stone-900 p-2 border-2 border-stone-800">
          <CoinIcon className="w-8 h-8 mr-2" />
          <span>{score}</span>
        </div>
      </div>
      
      <div className="w-full bg-gray-900 border-2 border-gray-500 mb-6">
        <div className="bg-green-500 h-4" style={{ width: `${progressPercentage}%` }}></div>
      </div>
      
      <div className="bg-stone-900/50 p-6 mb-6 min-h-[120px] flex flex-col items-center justify-center">
        {currentQuestion.visual && (
          <div
            className="mb-4 bg-white p-2 max-w-xs"
            dangerouslySetInnerHTML={{ __html: currentQuestion.visual }}
          />
        )}
        <h2 className="text-2xl leading-relaxed text-center">{currentQuestion.question}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* FIX: Use a more robust type assertion for the object keys to ensure 'key' is correctly typed. */}
        {(Object.keys(currentQuestion.options) as (keyof QuizQuestion['options'])[]).map((key) => {
          const isCorrect = key === currentQuestion.correctAnswer;
          const isSelected = selectedAnswer === key;
          let buttonClass = 'bg-blue-600 border-blue-800 hover:bg-blue-700';
          if(isAnswered) {
              if (isCorrect) buttonClass = 'bg-green-600 border-green-800';
              else if (isSelected) buttonClass = 'bg-red-600 border-red-800';
              else buttonClass = 'bg-gray-600 border-gray-800 opacity-50';
          }
          return (
            <MinecraftButton key={key} onClick={() => handleAnswer(key)} disabled={isAnswered} className={`!${buttonClass} w-full text-left !py-4 !px-6 text-xl`}>
              <span className="font-bold mr-4">{key}:</span>{currentQuestion.options[key]}
            </MinecraftButton>
          )
        })}
      </div>
      
      {showHelpPrompt && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-10">
          <div className="bg-stone-700 p-8 border-4 border-stone-900 text-center">
            <h3 className="text-3xl mb-6">Need a little help?</h3>
            <div className="flex gap-4">
              <MinecraftButton onClick={handleGetHint} className="!bg-green-600 !border-green-800">Yes, give me a hint!</MinecraftButton>
              <MinecraftButton onClick={() => setShowHelpPrompt(false)} className="!bg-red-600 !border-red-800">No, I've got this.</MinecraftButton>
            </div>
          </div>
        </div>
      )}

      {hint && (
        <div className="mt-6 p-4 bg-yellow-600/20 border-2 border-yellow-500 text-yellow-200">
          <strong>Hint:</strong> {hint}
        </div>
      )}
    </div>
  );
};

export default QuizScreen;
