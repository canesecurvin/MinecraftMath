
import React from 'react';
import type { CharacterOptions } from '../types';

interface CharacterPreviewProps {
  character: CharacterOptions;
}

const CharacterPreview: React.FC<CharacterPreviewProps> = ({ character }) => {
  const { skinColor, hairStyle, hairColor, shirtColor, pantsColor, shoesColor } = character;

  const hairClasses = 'absolute w-full h-1/2 top-0';
  const hairStyleDiv = () => {
    switch(hairStyle) {
        case 'long':
            return <div className={hairClasses} style={{ backgroundColor: hairColor, height: '75%' }}></div>;
        case 'mohawk':
            return <div className="absolute w-1/3 h-1/2 top-[-15px] left-1/3" style={{ backgroundColor: hairColor }}></div>;
        case 'short':
        default:
            return <div className={hairClasses} style={{ backgroundColor: hairColor }}></div>;
    }
  }

  return (
    <div className="relative w-40 h-80 mx-auto scale-125">
      {/* Head */}
      <div className="absolute top-0 left-1/4 w-1/2 h-1/4" style={{ backgroundColor: skinColor }}>
        {hairStyleDiv()}
        {/* Eyes */}
        <div className="absolute top-1/2 -translate-y-1/2 w-full flex justify-around">
            <div className="w-1/4 h-1/4 bg-white"><div className="w-1/2 h-full bg-blue-800 ml-auto"></div></div>
            <div className="w-1/4 h-1/4 bg-white"><div className="w-1/2 h-full bg-blue-800 ml-auto"></div></div>
        </div>
      </div>

      {/* Torso */}
      <div className="absolute top-1/4 left-1/4 w-1/2 h-2/5" style={{ backgroundColor: shirtColor }}></div>

      {/* Arms */}
      <div className="absolute top-1/4 left-0 w-1/4 h-2/5" style={{ backgroundColor: skinColor }}>
        <div className="h-full" style={{ backgroundColor: shirtColor, height: '75%' }}></div>
      </div>
      <div className="absolute top-1/4 right-0 w-1/4 h-2/5" style={{ backgroundColor: skinColor }}>
        <div className="h-full" style={{ backgroundColor: shirtColor, height: '75%'}}></div>
      </div>

      {/* Legs */}
      <div className="absolute top-[65%] left-1/4 w-1/4 h-[25%]" style={{ backgroundColor: pantsColor }}></div>
      <div className="absolute top-[65%] right-1/4 w-1/4 h-[25%]" style={{ backgroundColor: pantsColor }}></div>
      
      {/* Shoes */}
      <div className="absolute bottom-0 left-1/4 w-1/4 h-[10%]" style={{ backgroundColor: shoesColor }}></div>
      <div className="absolute bottom-0 right-1/4 w-1/4 h-[10%]" style={{ backgroundColor: shoesColor }}></div>
    </div>
  );
};

export default CharacterPreview;
