'use client'

import KeyConfigForm from './components/KeyConfigForm'

export default function Page() {
  return (
    <section className='space-y-8'>
      <div>
        <h1 className='font-semibold text-2xl tracking-tighter'>
          MIDI Footswitch Configuration
        </h1>
        <p className='text-gray-600 mt-2'>
          Configure your MIDI footswitch by setting up key presses, LED colors,
          and MIDI/HID commands.
        </p>
      </div>

      <div className='bg-white rounded-lg shadow text-gray-600'>
        <KeyConfigForm />
      </div>
    </section>
  )
}
