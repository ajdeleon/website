// Command Types
export const COMMAND_TYPES = {
  PC: 'PC',
  CC: 'CC',
  NT: 'NT',
  HID: 'HID',
} as const

export type CommandType = keyof typeof COMMAND_TYPES

// Special PC Values
export const PC_SPECIAL_VALUES = [
  'inc1', 'inc2', 'inc3', 'inc4', 'inc5',
  'dec1', 'dec2', 'dec3', 'dec4', 'dec5',
  'random', 'auto',
] as const

// HID Action Types
export const HID_ACTIONS = {
  SEND: 'send',    // Quick press and release
  PRESS: 'press',  // Press only
  RELEASE: 'release', // Release only
  DELAY: 'delay',  // Pure delay
} as const

// HID Modifiers
export const HID_MODIFIERS = [
  'Ctrl', 'Shift', 'Alt', 'Option', 'Windows'
] as const

// HID Keys
export const HID_KEYS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12',
  'Mouse_L', 'Mouse_R', 'Space', 'Esc', 'Caps', 'Right', 'Left', 'Up', 'Down',
  'End', 'Del', 'PageUp', 'PageDown', 'Enter', 'Pause', 'Table', 'BackSpace',
  'Home', 'Ins', 'PrintS'
] as const

// Trigger Types
export const TRIGGER_TYPES = {
  SHORT_DOWN: 'short_dw',
  SHORT_UP: 'short_up',
  LONG: 'long',
  LONG_UP: 'long_up',
} as const

export type TriggerTypeValue = (typeof TRIGGER_TYPES)[keyof typeof TRIGGER_TYPES]

// LED Modes
export const LED_MODES = {
  normal: 'normal',
  select: 'select',
  tap: 'tap',
} as const

export type LedMode = keyof typeof LED_MODES

// Utility Functions
export const isValidHexColor = (color: string): boolean => {
  return /^0x[0-9A-Fa-f]{6}$/.test(color)
}

export const formatCommand = (command: KeyCommand): string => {
  if (command.type === 'HID') {
    return `[${command.value}][${command.type}][-][${command.param}]`
  }
  return `[${command.channel}][${command.type}][${command.value}][${command.param}]`
}

// Types
export interface KeyCommand {
  channel?: string
  type: CommandType
  value: string
  param: string
}

export interface TriggerTiming {
  commands: KeyCommand[]
}

export type LedColor = `0x${string}`

export interface KeyPress {
  ledcolor: [LedColor, LedColor, LedColor]
  short_dw?: TriggerTiming
  short_up?: TriggerTiming
  long?: TriggerTiming
  long_up?: TriggerTiming
}

export interface KeyConfig {
  keytimes: number
  ledmode: LedMode
  presses: KeyPress[]
}

export interface AllKeyConfigs {
  [key: string]: KeyConfig
}

export const defaultKeyPress: KeyPress = {
  ledcolor: ['0x666666', '0x666666', '0x666666'] as [LedColor, LedColor, LedColor],
  short_dw: undefined,
  short_up: undefined,
  long: undefined,
  long_up: undefined
}

export const defaultKeyConfig: KeyConfig = {
  keytimes: 1,
  ledmode: LED_MODES.normal,
  presses: [defaultKeyPress],
}