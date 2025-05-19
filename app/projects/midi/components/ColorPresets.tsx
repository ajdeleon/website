import { useState } from 'react';

interface ColorPresetsProps {
  onSelectColor: (color: string) => void;
}

const PRESET_COLORS = {
  'Off': '0x000000',
  'White': '0xffffff',
  'Dim White': '0x666666',
  'Red': '0xff0000',
  'Green': '0x00ff00',
  'Blue': '0x0000ff',
  'Yellow': '0xffff00',
  'Purple': '0xff00ff',
  'Cyan': '0x00ffff',
  'Orange': '0xff8800',
  'Pink': '0xff66ff',
  'Lime': '0x88ff00',
};

export default function ColorPresets({ onSelectColor }: ColorPresetsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
      >
        {isExpanded ? '▼' : '▶'} Color Presets
      </button>
      
      {isExpanded && (
        <div className="grid grid-cols-4 gap-2 mt-2">
          {Object.entries(PRESET_COLORS).map(([name, color]) => (
            <button
              key={color}
              onClick={() => onSelectColor(color)}
              className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 border text-sm"
            >
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: `#${color.slice(2)}` }}
              />
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}