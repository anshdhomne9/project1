
'use client';

import { useTheme } from '@/contexts/ThemeContext';
import { themes, ThemeName } from '@/contexts/themes';

export default function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <div className="bg-[var(--card-background)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[var(--border-color)] p-4">
      <h3 className="text-lg font-semibold mb-3 text-[var(--text-primary)]">Change Theme</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.keys(themes).map((themeName) => (
          <button
            key={themeName}
            onClick={() => setTheme(themeName as ThemeName)}
            className="px-3 py-2 text-sm rounded-lg capitalize transition-colors duration-200 border border-transparent hover:border-[var(--border-color)]"
            style={{
              backgroundColor: themes[themeName as ThemeName]['--accent-primary'],
              color: themes[themeName as ThemeName]['--text-primary'],
            }}
          >
            {themeName}
          </button>
        ))}
      </div>
    </div>
  );
}
