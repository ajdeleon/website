import { AllKeyConfigs, TRIGGER_TYPES, formatCommand } from '../utils/config';

interface ConfigExportProps {
  configs: AllKeyConfigs;
}

export default function ConfigExport({ configs }: ConfigExportProps) {
  const generateConfigFile = () => {
    let configContent = '[globalsetup]\n';
    configContent += '# Global settings\n';
    configContent += 'ledbright = [30]\n';
    configContent += 'screenbright = [80]\n';
    configContent += 'dark_fonts = [off]\n';
    configContent += 'wallpaper = [wp1]\n';
    configContent += 'long_press_timing = [1]\n\n';

    // Add page settings
    configContent += '[PAGE]\n';
    configContent += 'page_name = [MIDI]\n';
    configContent += 'exp1_CH = [1]\n';
    configContent += 'exp1_CC = [1]\n';
    configContent += 'exp2_CH = [1]\n';
    configContent += 'exp2_CC = [2]\n';
    configContent += 'encoder_CC = [90]\n';
    configContent += 'encoder_NAME = [MYCC]\n';
    configContent += 'midithrough = [on]\n';
    configContent += 'display_number_ABC = [123]\n';
    configContent += 'group_number = [3]\n';
    configContent += 'display_pc_offset = [1]\n';
    configContent += 'display_bank_offset = [1]\n\n';

    // Add key configurations
    Object.entries(configs).forEach(([key, config]) => {
      configContent += `[${key}]\n`;
      configContent += `keytimes = [${config.keytimes}]\n`;
      configContent += `ledmode = [${config.ledmode}]\n`;

      config.presses.forEach((press, index) => {
        // LED colors
        configContent += `ledcolor${index + 1} = [${press.ledcolor.join('][')}]\n`;

        // Commands for each trigger type
        Object.values(TRIGGER_TYPES).forEach(triggerType => {
          const timing = press[triggerType];
          if (timing?.commands.length) {
            const commands = timing.commands
              .map(formatCommand)
              .join(' ');
            configContent += `${triggerType}${index + 1} = ${commands}\n`;
          }
        });
      });

      configContent += '\n';
    });

    return configContent;
  };

  const downloadConfig = () => {
    const content = generateConfigFile();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'supersetup/page0.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Configuration Export</h3>
        <button
          onClick={downloadConfig}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Download Config
        </button>
      </div>
      <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
        {generateConfigFile()}
      </pre>
    </div>
  );
}