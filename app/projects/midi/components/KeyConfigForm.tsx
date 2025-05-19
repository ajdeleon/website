import { useState } from 'react'
import {
  TRIGGER_TYPES,
  LED_MODES,
  KeyConfig,
  KeyCommand,
  TriggerTypeValue,
  defaultKeyConfig,
  isValidHexColor,
  formatCommand,
  AllKeyConfigs,
} from '../utils/config'
import CommandEditor from './CommandEditor'
import LedPreview from './LedPreview'
import ColorPresets from './ColorPresets'
import ConfigExport from './ConfigExport'

export default function KeyConfigForm() {
  const [selectedKey, setSelectedKey] = useState('key0')
  const [allConfigs, setAllConfigs] = useState<AllKeyConfigs>({
    key0: defaultKeyConfig,
  })
  const [activePress, setActivePress] = useState(0)

  const keyConfig = allConfigs[selectedKey]
  const setKeyConfig = (
    newConfig: KeyConfig | ((prev: KeyConfig) => KeyConfig)
  ) => {
    setAllConfigs((prev) => ({
      ...prev,
      [selectedKey]:
        typeof newConfig === 'function'
          ? newConfig(prev[selectedKey])
          : newConfig,
    }))
  }

  const handleKeytimesChange = (value: number) => {
    const newValue = Math.max(1, Math.min(9, value))
    setKeyConfig((prev) => {
      const newPresses = Array(newValue)
        .fill(null)
        .map(
          (_, i) =>
            prev.presses[i] || {
              ledcolor: ['0x666666', '0x666666', '0x666666'],
            }
        )
      return {
        ...prev,
        keytimes: newValue,
        presses: newPresses,
      }
    })
    setActivePress(Math.min(activePress, newValue - 1))
  }

  const handleLedcolorChange = (
    pressIndex: number,
    segmentIndex: number,
    value: string
  ) => {
    let formattedValue: string
    if (!value.startsWith('0x')) {
      formattedValue = '0x' + value.replace(/[^0-9A-Fa-f]/g, '')
    } else {
      formattedValue = value
    }
    formattedValue = formattedValue.slice(0, 8)

    // Ensure value matches LedColor format
    if (!isValidHexColor(formattedValue)) {
      return
    }

    setKeyConfig((prev) => {
      const newPresses = [...prev.presses]
      const newLedcolor = [...newPresses[pressIndex].ledcolor]
      newLedcolor[segmentIndex] = formattedValue as `0x${string}`
      newPresses[pressIndex] = {
        ...newPresses[pressIndex],
        ledcolor: newLedcolor as [`0x${string}`, `0x${string}`, `0x${string}`],
      }
      return {
        ...prev,
        presses: newPresses,
      }
    })
  }

  const addCommand = (pressIndex: number, triggerValue: TriggerTypeValue) => {
    setKeyConfig((prev) => {
      const newPresses = [...prev.presses]
      const press = newPresses[pressIndex]
      const newTiming = press[triggerValue] || { commands: [] }

      const newCommand: KeyCommand = {
        channel: '1',
        type: 'PC',
        value: '0',
        param: '-',
      }

      newTiming.commands = [...newTiming.commands, newCommand]
      newPresses[pressIndex] = {
        ...press,
        [triggerValue]: newTiming,
      }

      return {
        ...prev,
        presses: newPresses,
      }
    })
  }

  const updateCommand = (
    pressIndex: number,
    triggerValue: TriggerTypeValue,
    commandIndex: number,
    newCommand: KeyCommand
  ) => {
    setKeyConfig((prev) => {
      const newPresses = [...prev.presses]
      const press = newPresses[pressIndex]
      const timing = press[triggerValue]
      if (!timing) return prev

      const newCommands = [...timing.commands]
      newCommands[commandIndex] = newCommand

      newPresses[pressIndex] = {
        ...press,
        [triggerValue]: {
          ...timing,
          commands: newCommands,
        },
      }

      return {
        ...prev,
        presses: newPresses,
      }
    })
  }

  const deleteCommand = (
    pressIndex: number,
    triggerValue: TriggerTypeValue,
    commandIndex: number
  ) => {
    setKeyConfig((prev) => {
      const newPresses = [...prev.presses]
      const press = newPresses[pressIndex]
      const timing = press[triggerValue]
      if (!timing) return prev

      const newCommands = timing.commands.filter((_, i) => i !== commandIndex)

      newPresses[pressIndex] = {
        ...press,
        [triggerValue]: {
          ...timing,
          commands: newCommands,
        },
      }

      return {
        ...prev,
        presses: newPresses,
      }
    })
  }

  return (
    <div className='space-y-6 p-4'>
      <div className='flex space-x-4 mb-6'>
        <div className='flex-1'>
          <label className='block text-sm font-medium mb-2'>
            Select Key
            <select
              value={selectedKey}
              onChange={(e) => {
                const newKey = e.target.value
                setSelectedKey(newKey)
                if (!allConfigs[newKey]) {
                  setAllConfigs((prev) => ({
                    ...prev,
                    [newKey]: defaultKeyConfig,
                  }))
                }
              }}
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'
            >
              {Array.from({ length: 10 }, (_, i) => (
                <option key={i} value={`key${i}`}>
                  Key {i}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className='flex-1'>
          <label className='block text-sm font-medium mb-2'>
            Key Times (1-9)
            <input
              type='number'
              min={1}
              max={9}
              value={keyConfig.keytimes}
              onChange={(e) => handleKeytimesChange(parseInt(e.target.value))}
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'
            />
          </label>
        </div>

        <div className='flex-1'>
          <label className='block text-sm font-medium mb-2'>
            LED Mode
            <select
              value={keyConfig.ledmode}
              onChange={(e) =>
                setKeyConfig((prev) => ({
                  ...prev,
                  ledmode: e.target.value as keyof typeof LED_MODES,
                }))
              }
              className='mt-1 block w-full rounded-md border border-gray-300 px-3 py-2'
            >
              {Object.entries(LED_MODES).map(([key, value]) => (
                <option key={key} value={value}>
                  {key}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className='flex space-x-2 overflow-x-auto py-2'>
        {keyConfig.presses.map((_, index) => (
          <button
            key={index}
            onClick={() => setActivePress(index)}
            className={`px-4 py-2 rounded ${
              activePress === index
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            Press {index + 1}
          </button>
        ))}
      </div>

      {keyConfig.presses[activePress] && (
        <div className='space-y-6 border rounded-lg p-4'>
          <div>
            <h3 className='text-lg font-medium mb-3'>LED Colors</h3>
            <div className='flex items-start space-x-8'>
              <div className='flex-1 space-y-4'>
                <div className='space-y-2'>
                  <h4 className='text-sm font-medium'>Quick Patterns</h4>
                  <div className='flex space-x-2'>
                    <button
                      onClick={() => {
                        const color = keyConfig.presses[activePress].ledcolor[0]
                        handleLedcolorChange(activePress, 1, color)
                        handleLedcolorChange(activePress, 2, color)
                      }}
                      className='px-3 py-1 text-sm border rounded hover:bg-gray-50'
                    >
                      All Same
                    </button>
                    <button
                      onClick={() => {
                        handleLedcolorChange(activePress, 0, '0x666666')
                        handleLedcolorChange(activePress, 1, '0x666666')
                        handleLedcolorChange(activePress, 2, '0xff0000')
                      }}
                      className='px-3 py-1 text-sm border rounded hover:bg-gray-50'
                    >
                      Default
                    </button>
                  </div>
                </div>
                <div className='grid grid-cols-3 gap-4'>
                  {keyConfig.presses[activePress].ledcolor.map((color, i) => (
                    <div key={i}>
                      <label className='block text-sm font-medium mb-1'>
                        Segment {i + 1}
                      </label>
                      <div className='flex space-x-2'>
                        <input
                          type='text'
                          value={color}
                          onChange={(e) =>
                            handleLedcolorChange(activePress, i, e.target.value)
                          }
                          className={`block w-full rounded-md border px-3 py-2 ${
                            isValidHexColor(color)
                              ? 'border-gray-300'
                              : 'border-red-500'
                          }`}
                        />
                        <div
                          className='w-10 h-10 rounded border'
                          style={{
                            backgroundColor: `#${color.slice(2)}`,
                          }}
                        />
                      </div>
                      <ColorPresets
                        onSelectColor={(color) =>
                          handleLedcolorChange(activePress, i, color)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className='flex flex-col items-center mt-4'>
              <h4 className='text-sm font-medium mb-2'>Preview</h4>
              <LedPreview colors={keyConfig.presses[activePress].ledcolor} />
            </div>
          </div>

          {Object.entries(TRIGGER_TYPES).map(([key, triggerValue]) => (
            <div key={triggerValue} className='space-y-2'>
              <div className='flex justify-between items-center'>
                <h3 className='text-lg font-medium'>{key}</h3>
                <button
                  onClick={() => addCommand(activePress, triggerValue)}
                  className='px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600'
                >
                  Add Command
                </button>
              </div>

              <div className='space-y-2'>
                {keyConfig.presses[activePress][triggerValue]?.commands.map(
                  (command, cmdIndex) => (
                    <CommandEditor
                      key={cmdIndex}
                      command={command}
                      onUpdate={(newCommand) =>
                        updateCommand(
                          activePress,
                          triggerValue,
                          cmdIndex,
                          newCommand
                        )
                      }
                      onDelete={() =>
                        deleteCommand(activePress, triggerValue, cmdIndex)
                      }
                    />
                  )
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfigExport configs={allConfigs} />
    </div>
  )
}