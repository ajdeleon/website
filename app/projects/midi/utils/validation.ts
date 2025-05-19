import {
  KeyConfig,
  AllKeyConfigs,
  KeyCommand,
  isValidHexColor,
  TriggerTypeValue,
} from './config'

export interface ValidationResult {
  type: 'error' | 'warning' | 'info'
  message: string
}

export function validateKeyCommand(command: KeyCommand): ValidationResult[] {
  const results: ValidationResult[] = []

  if (
    command.type !== 'HID' &&
    (!command.channel ||
      parseInt(command.channel) < 1 ||
      parseInt(command.channel) > 16)
  ) {
    results.push({
      type: 'error',
      message: `MIDI channel must be between 1 and 16, got: ${command.channel}`,
    })
  }

  if (command.type === 'CC' || command.type === 'NT') {
    if (parseInt(command.value) < 0 || parseInt(command.value) > 127) {
      results.push({
        type: 'error',
        message: `${command.type} value must be between 0 and 127, got: ${command.value}`,
      })
    }
    if (parseInt(command.param) < 0 || parseInt(command.param) > 127) {
      results.push({
        type: 'error',
        message: `${command.type} parameter must be between 0 and 127, got: ${command.param}`,
      })
    }
  }

  return results
}

export function validateKeyConfig(config: KeyConfig): ValidationResult[] {
  const results: ValidationResult[] = []

  // Validate keytimes
  if (config.keytimes < 1 || config.keytimes > 9) {
    results.push({
      type: 'error',
      message: `Keytimes must be between 1 and 9, got: ${config.keytimes}`,
    })
  }

  // Validate number of presses matches keytimes
  if (config.presses.length !== config.keytimes) {
    results.push({
      type: 'error',
      message: `Number of presses (${config.presses.length}) doesn't match keytimes (${config.keytimes})`,
    })
  }

  // Validate each press
  config.presses.forEach((press, pressIndex) => {
    // Validate LED colors
    press.ledcolor.forEach((color, index) => {
      if (!isValidHexColor(color)) {
        results.push({
          type: 'error',
          message: `Invalid LED color format for press ${pressIndex + 1}, segment ${index + 1}: ${color}`,
        })
      }
    })

    // Validate commands in each trigger timing
    ;['short_dw', 'short_up', 'long', 'long_up'].forEach((timing) => {
      const timingValue = press[timing as TriggerTypeValue]
      const commands = timingValue?.commands
      if (commands) {
        commands.forEach((command, cmdIndex) => {
          const commandValidation = validateKeyCommand(command)
          commandValidation.forEach((result) => {
            results.push({
              type: result.type,
              message: `Press ${pressIndex + 1}, ${timing} command ${cmdIndex + 1}: ${result.message}`,
            })
          })
        })
      }
    })
  })

  return results
}

export function validateAllConfigs(configs: AllKeyConfigs): ValidationResult[] {
  const results: ValidationResult[] = []

  // Validate each key configuration
  Object.entries(configs).forEach(([key, config]) => {
    const keyValidation = validateKeyConfig(config)
    keyValidation.forEach((result) => {
      results.push({
        type: result.type,
        message: `${key}: ${result.message}`,
      })
    })
  })

  // Check if there are any keys configured
  if (Object.keys(configs).length === 0) {
    results.push({
      type: 'warning',
      message: 'No keys are configured',
    })
  }

  return results
}
