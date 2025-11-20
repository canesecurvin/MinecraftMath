
import React, { useState, useMemo } from 'react';
import type { UserProfile, CharacterOptions } from '../types';
import { GRADES, GRADE_SUBJECTS_MAP, DEFAULT_CHARACTER, CUSTOMIZATION_OPTIONS } from '../constants';
import CharacterPreview from './CharacterPreview';
import MinecraftButton from './MinecraftButton';
import MinecraftInput from './MinecraftInput';
import MinecraftSelect from './MinecraftSelect';

interface CharacterCreatorProps {
  onStartQuiz: (profile: UserProfile) => void;
  onViewProgress: () => void;
}

const OptionButton: React.FC<{onClick: () => void, children: React.ReactNode}> = ({onClick, children}) => (
    <button onClick={onClick} className="w-8 h-8 text-xl bg-gray-600 hover:bg-gray-700 active:bg-gray-800 border-b-2 border-gray-800">
        {children}
    </button>
);

const CharacterCreator: React.FC<CharacterCreatorProps> = ({ onStartQuiz, onViewProgress }) => {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState(GRADES[0]);
  const [subject, setSubject] = useState(GRADE_SUBJECTS_MAP[GRADES[0]][0]);
  const [character, setCharacter] = useState<CharacterOptions>(DEFAULT_CHARACTER);

  const availableSubjects = useMemo(() => GRADE_SUBJECTS_MAP[grade] || [], [grade]);

  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newGrade = e.target.value;
    setGrade(newGrade);
    setSubject(GRADE_SUBJECTS_MAP[newGrade][0]);
  };

  const cycleOption = <T,>(key: keyof CharacterOptions, options: T[]) => {
    const currentIndex = options.indexOf(character[key] as any);
    const nextIndex = (currentIndex + 1) % options.length;
    setCharacter(prev => ({ ...prev, [key]: options[nextIndex] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStartQuiz({ name, grade, subject, character });
    }
  };
  
  const CustomizationRow: React.FC<{label: string, optionKey: keyof CharacterOptions, options: string[]}> = ({label, optionKey, options}) => (
    <div className="flex items-center justify-between">
      <span className="text-lg">{label}</span>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 border-2 border-gray-800" style={{ backgroundColor: character[optionKey] }}></div>
        <OptionButton onClick={() => cycleOption(optionKey, options)}>{'>'}</OptionButton>
      </div>
    </div>
  );
  
  const HairStyleRow: React.FC = () => (
      <div className="flex items-center justify-between">
        <span className="text-lg">Hair Style</span>
        <div className="flex items-center gap-2">
            <span className="w-16 text-center">{character.hairStyle}</span>
            <OptionButton onClick={() => cycleOption('hairStyle', CUSTOMIZATION_OPTIONS.hairStyle)}>{'>'}</OptionButton>
        </div>
      </div>
  );

  return (
    <div className="bg-stone-700/80 p-6 md:p-8 border-4 border-t-stone-500 border-l-stone-500 border-b-stone-900 border-r-stone-900">
      <h1 className="text-4xl text-center mb-8 text-yellow-400">Minecraft Math Quest</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="flex flex-col items-center justify-center p-4 bg-stone-900/50 border-2 border-stone-800">
            <h2 className="text-2xl mb-4">Create Your Hero</h2>
            <CharacterPreview character={character} />
        </div>
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-stone-800/60 space-y-4">
              <h3 className="text-xl mb-2">Customize</h3>
              <CustomizationRow label="Skin" optionKey="skinColor" options={CUSTOMIZATION_OPTIONS.skinColor} />
              <HairStyleRow />
              <CustomizationRow label="Hair Color" optionKey="hairColor" options={CUSTOMIZATION_OPTIONS.hairColor} />
              <CustomizationRow label="Shirt" optionKey="shirtColor" options={CUSTOMIZATION_OPTIONS.shirtColor} />
              <CustomizationRow label="Pants" optionKey="pantsColor" options={CUSTOMIZATION_OPTIONS.pantsColor} />
              <CustomizationRow label="Shoes" optionKey="shoesColor" options={CUSTOMIZATION_OPTIONS.shoesColor} />
            </div>

            <MinecraftInput label="Enter Your Name:" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <MinecraftSelect label="Select Your Grade:" value={grade} onChange={handleGradeChange}>
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </MinecraftSelect>
            <MinecraftSelect label="Select a Subject:" value={subject} onChange={(e) => setSubject(e.target.value)}>
              {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
            </MinecraftSelect>
            <div className="flex flex-col md:flex-row gap-4 pt-2">
                <MinecraftButton type="submit" className="w-full !bg-green-600 !border-green-800 hover:!bg-green-700 text-xl">
                  Start Quest!
                </MinecraftButton>
                <MinecraftButton type="button" onClick={onViewProgress} className="w-full !bg-sky-600 !border-sky-800 hover:!bg-sky-700 text-xl">
                  My Progress
                </MinecraftButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreator;
