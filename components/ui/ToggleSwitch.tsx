'use client';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: () => void;
}

export default function ToggleSwitch({ enabled, onChange }: ToggleSwitchProps) {
  return (
    <button
      onClick={onChange}
      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300
        ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}
      aria-pressed={enabled}
    >
      <span
        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300
          ${enabled ? 'translate-x-6' : 'translate-x-0'}`}
      />
    </button>
  );
}
