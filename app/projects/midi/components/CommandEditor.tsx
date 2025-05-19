import { useState } from 'react'
import {
  COMMAND_TYPES,
  CommandType,
  HID_ACTIONS,
  HID_KEYS,
  HID_MODIFIERS,
  KeyCommand,
  PC_SPECIAL_VALUES,
} from '../utils/config'

interface CommandEditorProps {
  command: KeyCommand
  onUpdate: (command: KeyCommand) => void
  onDelete: () => void
}

export default function CommandEditor({
  command,
  onUpdate,
  onDelete,
}: CommandEditorProps) {
  const handleTypeChange = (type: CommandType) => {
    const newCommand: KeyCommand = {
      ...command,
      type,
      value: type === 'HID' ? HID_ACTIONS.SEND : '1',
      param: type === 'HID' ? HID_KEYS[0] : '0',
    }
    if (type === 'HID') {
      delete newCommand.channel
    } else {
      newCommand.channel = '1'
    }
    onUpdate(newCommand)
  }

  return (
    <div className='flex items-start space-x-2 p-2 border rounded'>
      {/* Command Type */}
      <select
        value={command.type}
        onChange={(e) => handleTypeChange(e.target.value as CommandType)}
        className='rounded border px-2 py-1'
      >
        {Object.values(COMMAND_TYPES).map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      {/* MIDI Channel (for non-HID commands) */}
      {command.type !== 'HID' && (
        <input
          type='number'
          min='1'
          max='16'
          value={command.channel}
          onChange={(e) => onUpdate({ ...command, channel: e.target.value })}
          className='w-16 rounded border px-2 py-1'
          placeholder='Ch'
        />
      )}

      {/* Command Value */}
      {command.type === 'PC' ? (
        <select
          value={command.value}
          onChange={(e) => onUpdate({ ...command, value: e.target.value })}
          className='rounded border px-2 py-1'
        >
          {/* Standard PC numbers */}
          {Array.from({ length: 128 }, (_, i) => (
            <option key={i} value={i}>
              PC {i}
            </option>
          ))}
          {/* Special PC values */}
          {PC_SPECIAL_VALUES.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      ) : command.type === 'HID' ? (
        <select
          value={command.value}
          onChange={(e) => onUpdate({ ...command, value: e.target.value })}
          className='rounded border px-2 py-1'
        >
          {Object.values(HID_ACTIONS).map((action) => (
            <option key={action} value={action}>
              {action}
            </option>
          ))}
        </select>
      ) : (
        <input
          type='number'
          min='0'
          max='127'
          value={command.value}
          onChange={(e) => onUpdate({ ...command, value: e.target.value })}
          className='w-20 rounded border px-2 py-1'
          placeholder='Value'
        />
      )}

      {/* Command Parameter */}
      {command.type === 'HID' ? (
        <select
          value={command.param}
          onChange={(e) => onUpdate({ ...command, param: e.target.value })}
          className='rounded border px-2 py-1'
        >
          {command.value === 'delay' ? (
            Array.from({ length: 20 }, (_, i) => (
              <option key={i * 50} value={i * 50}>
                {i * 50}ms
              </option>
            ))
          ) : (
            <>
              {HID_KEYS.map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
              {HID_MODIFIERS.map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
            </>
          )}
        </select>
      ) : (
        <input
          type='number'
          min='0'
          max='127'
          value={command.param}
          onChange={(e) => onUpdate({ ...command, param: e.target.value })}
          className='w-20 rounded border px-2 py-1'
          placeholder='Param'
        />
      )}

      {/* Delete Button */}
      <button
        onClick={onDelete}
        className='px-2 py-1 text-red-600 hover:text-red-800'
      >
        X
      </button>
    </div>
  )
}
