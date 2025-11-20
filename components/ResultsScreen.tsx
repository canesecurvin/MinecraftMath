import React, { useState, useMemo, useEffect } from 'react';
import type { UserProfile, QuizResult } from '../types';
import { summarizeResultsForParent, generateCharacterAscii } from '../services/geminiService';
import { saveQuizSession } from '../services/progressService';
import MinecraftButton from './MinecraftButton';
import CharacterPreview from './CharacterPreview';
import CoinIcon from './icons/CoinIcon';

interface ResultsScreenProps {
  userProfile: UserProfile;
  results: QuizResult[];
  onPlayAgain: () => void;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ userProfile, results, onPlayAgain }) => {
  const [parentEmail, setParentEmail] = useState('');
  const [emailSummary, setEmailSummary] = useState('');
  const [isSummaryLoading, setIsSummaryLoading] = useState(false);

  const score = useMemo(() => {
    return results.filter(r => r.isCorrect).length * 10;
  }, [results]);

  useEffect(() => {
    if (results.length > 0) {
      const session = {
        date: new Date().toISOString(),
        grade: userProfile.grade,
        subject: userProfile.subject,
        score,
        results,
      };
      saveQuizSession(session);
    }
  }, [userProfile, results, score]);

  const handleGenerateEmail = async () => {
    if (!parentEmail) {
      alert("Please enter a parent's email address.");
      return;
    }
    setIsSummaryLoading(true);
    const asciiArt = await generateCharacterAscii(userProfile.character);
    const summary = await summarizeResultsForParent(userProfile, results, score, asciiArt);
    setEmailSummary(summary);
    setIsSummaryLoading(false);
  };

  const handleSendEmail = () => {
    const subject = `Minecraft Math Quest Results for ${userProfile.name}`;
    window.location.href = `mailto:${parentEmail}?subject=${subject}&body=${emailSummary}`;
  }

  return (
    <div className="bg-stone-700/80 p-6 md:p-8 border-4 border-t-stone-500 border-l-stone-500 border-b-stone-900 border-r-stone-900 text-center">
      <h1 className="text-4xl text-yellow-400 mb-4">Quest Complete!</h1>
      <div className="flex items-center justify-center text-6xl my-8">
        <CoinIcon className="w-16 h-16 mr-4" />
        <span>{score}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-start">
        <div className="bg-stone-900/50 p-6 text-left">
          <h2 className="text-2xl mb-4 text-center">Your Performance</h2>
          <ul className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {results.map((result, index) => (
              <li key={index} className={`p-3 ${result.isCorrect ? 'bg-green-800/40' : 'bg-red-800/40'}`}>
                <p className="font-bold">Q: {result.question}</p>
                <p>Your answer: {result.userAnswer} {result.neededHelp && <span className="text-yellow-300">(Hint)</span>}</p>
                {!result.isCorrect && <p>Correct answer: {result.correctAnswer}</p>}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <CharacterPreview character={userProfile.character} />
          <div className="w-full bg-stone-900/50 p-6 space-y-4">
              <h2 className="text-2xl mb-4">Share with a Parent</h2>
              <input 
                type="email"
                placeholder="Parent's Email Address"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                className="w-full bg-gray-900 border-2 border-t-gray-500 border-l-gray-500 border-r-gray-800 border-b-gray-800 text-white p-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <MinecraftButton 
                onClick={emailSummary ? handleSendEmail : handleGenerateEmail} 
                disabled={isSummaryLoading || !parentEmail} 
                className="w-full !bg-blue-600 !border-blue-800"
              >
                {isSummaryLoading ? 'Generating...' : (emailSummary ? 'Send Email' : 'Generate Email Content')}
              </MinecraftButton>
              {emailSummary && (
                <div className="mt-4 text-left">
                  <h3 className="text-xl mb-2">Email Preview:</h3>
                  <pre className="whitespace-pre-wrap bg-stone-800 p-4 border-2 border-stone-900 font-mono text-sm max-h-48 overflow-y-auto">
                    {decodeURIComponent(emailSummary)}
                  </pre>
                </div>
              )}
          </div>
          <MinecraftButton onClick={onPlayAgain} className="w-full !bg-green-600 !border-green-800 text-2xl">
            Play Again!
          </MinecraftButton>
        </div>
      </div>
    </div>
  );
};

export default ResultsScreen;
