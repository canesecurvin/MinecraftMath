
import React, { useState, useEffect, useMemo } from 'react';
import { getQuizHistory } from '../services/progressService';
import type { QuizSession } from '../types';
import MinecraftButton from './MinecraftButton';

interface ProgressDashboardProps {
  onBack: () => void;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ onBack }) => {
  const [history, setHistory] = useState<QuizSession[]>([]);

  useEffect(() => {
    setHistory(getQuizHistory());
  }, []);

  const strugglingTopics = useMemo(() => {
    const topics = new Map<string, { count: number; neededHelpCount: number }>();
    
    history.forEach(session => {
        session.results.forEach(result => {
            if (!result.isCorrect || result.neededHelp) {
                const entry = topics.get(result.question) || { count: 0, neededHelpCount: 0 };
                entry.count++;
                if (result.neededHelp) {
                    entry.neededHelpCount++;
                }
                topics.set(result.question, entry);
            }
        });
    });

    return [...topics.entries()]
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 5); // Show top 5
  }, [history]);

  if (history.length === 0) {
    return (
      <div className="bg-stone-700/80 p-8 border-4 border-t-stone-500 border-l-stone-500 border-b-stone-900 border-r-stone-900 text-center">
        <h1 className="text-3xl text-yellow-400 mb-4">No Adventures Yet!</h1>
        <p className="text-lg mb-6">Complete a quiz to see your progress logged here.</p>
        <MinecraftButton onClick={onBack} className="!bg-green-600 !border-green-800">Back to Creator</MinecraftButton>
      </div>
    );
  }

  return (
    <div className="bg-stone-700/80 p-6 md:p-8 border-4 border-t-stone-500 border-l-stone-500 border-b-stone-900 border-r-stone-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl text-yellow-400">Your Progress</h1>
        <MinecraftButton onClick={onBack}>Back</MinecraftButton>
      </div>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-stone-900/50 p-6">
          <h2 className="text-2xl mb-4 text-center">Quest Log</h2>
          <div className="max-h-[50vh] overflow-y-auto pr-2 space-y-4">
            {history.map((session, index) => (
              <div key={index} className="bg-stone-800/60 p-4 border-2 border-stone-700">
                <p><strong>Date:</strong> {new Date(session.date).toLocaleDateString()}</p>
                <p><strong>Subject:</strong> {session.subject} ({session.grade})</p>
                <p className={`font-bold ${session.score >= 70 ? 'text-green-400' : 'text-red-400'}`}>
                    Score: {session.score}/100
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-stone-900/50 p-6">
          <h2 className="text-2xl mb-4 text-center">Areas to Practice</h2>
          {strugglingTopics.length > 0 ? (
            <ul className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
              {strugglingTopics.map(([question, data]) => (
                <li key={question} className="p-3 bg-red-800/30 border-2 border-red-900/50">
                  <p className="font-bold">{question}</p>
                  <p className="text-sm text-gray-300">Missed: {data.count} time(s), Needed Hint: {data.neededHelpCount} time(s)</p>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-green-400 h-full flex items-center justify-center">
                <p>No specific weak spots found. Great work!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
