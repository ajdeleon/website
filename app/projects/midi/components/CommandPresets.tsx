import { KeyCommand } from '../utils/config';

interface CommandPresetsProps {
  onSelectPreset: (commands: KeyCommand[]) => void;
}

const PRESETS: Record<string, { name: string; commands: KeyCommand[] }> = {
  programChange: {
    name: 'Program Change',
    commands: [{
      channel: '1',
      type: 'PC',
      value: '0',
      param: '-',
    }],
  },
  toggleCC: {
    name: 'Toggle CC (0/127)',
    commands: [{
      channel: '1',
      type: 'CC',
      value: '64',
      param: '127',
    }],
  },
  noteOnOff: {
    name: 'Note On/Off',
    commands: [
      {
        channel: '1',
        type: 'NT',
        value: '60',
        param: '127',
      },
      {
        channel: '1',
        type: 'NT',
        value: '60',
        param: '0',
      },
    ],
  },
  keyPress: {
    name: 'Keyboard Press',
    commands: [{
      type: 'HID',
      value: 'send',
      param: 'A',
    }],
  },
  mouseClick: {
    name: 'Mouse Click',
    commands: [{
      type: 'HID',
      value: 'send',
      param: 'Mouse_L',
    }],
  },
  bankIncrement: {
    name: 'Bank Increment',
    commands: [{
      channel: '1',
      type: 'PC',
      value: 'auto',
      param: 'bank_inc',
    }],
  },
};

export default function CommandPresets({ onSelectPreset }: CommandPresetsProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium text-gray-700">Presets</h4>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(PRESETS).map(([key, preset]) => (
          <button
            key={key}
            onClick={() => onSelectPreset(preset.commands)}
            className="text-left px-3 py-2 text-sm rounded border hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {preset.name}
          </button>
        ))}
      </div>
    </div>
  );
}