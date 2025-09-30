
export const themes = {
  default: {
    '--background-start': 'rgb(23, 21, 58)',
    '--background-end': 'rgb(43, 21, 58)',
    '--card-background': 'rgba(30, 30, 50, 0.3)',
    '--text-primary': 'rgb(255, 255, 255)',
    '--text-secondary': 'rgb(209, 213, 219)',
    '--accent-primary': 'rgb(99, 102, 241)', // indigo-500
    '--accent-secondary': 'rgb(34, 197, 94)', // green-500
    '--border-color': 'rgba(255, 255, 255, 0.1)',
  },
  sunset: {
    '--background-start': 'rgb(64, 23, 64)',
    '--background-end': 'rgb(255, 120, 80)',
    '--card-background': 'rgba(50, 30, 50, 0.3)',
    '--text-primary': 'rgb(255, 255, 255)',
    '--text-secondary': 'rgb(229, 221, 229)',
    '--accent-primary': 'rgb(251, 146, 60)', // orange-400
    '--accent-secondary': 'rgb(239, 68, 68)', // red-500
    '--border-color': 'rgba(255, 255, 255, 0.1)',
  },
  forest: {
    '--background-start': 'rgb(17, 38, 46)',
    '--background-end': 'rgb(22, 64, 55)',
    '--card-background': 'rgba(25, 50, 45, 0.3)',
    '--text-primary': 'rgb(255, 255, 255)',
    '--text-secondary': 'rgb(200, 220, 210)',
    '--accent-primary': 'rgb(34, 197, 94)', // green-500
    '--accent-secondary': 'rgb(59, 130, 246)', // blue-500
    '--border-color': 'rgba(255, 255, 255, 0.1)',
  },
  light: {
    '--background-start': 'rgb(229, 231, 235)',
    '--background-end': 'rgb(209, 213, 219)',
    '--card-background': 'rgba(255, 255, 255, 0.7)',
    '--text-primary': 'rgb(17, 24, 39)',
    '--text-secondary': 'rgb(55, 65, 81)',
    '--accent-primary': 'rgb(79, 70, 229)', // indigo-600
    '--accent-secondary': 'rgb(22, 163, 74)', // green-600
    '--border-color': 'rgba(0, 0, 0, 0.1)',
  },
};

export type ThemeName = keyof typeof themes;
