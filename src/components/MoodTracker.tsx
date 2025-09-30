
'use client';

import { useState, useEffect } from 'react';

interface MoodEntry {
  _id: string;
  mood: string;
  date: string;
}

const moods = [
  { emoji: '😄', name: 'Happy' },
  { emoji: '😊', name: 'Content' },
  { emoji: '😐', name: 'Neutral' },
  { emoji: '😔', name: 'Sad' },
  { emoji: '😡', name: 'Angry' },
  { emoji: '😴', name: 'Tired' },
  { emoji: '🤩', name: 'Excited' },
];

export default function MoodTracker() {
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const cardClasses = "bg-[var(--card-background)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[var(--border-color)] p-6 h-full flex flex-col";
  const buttonClasses = (isSelected: boolean) => `p-3 rounded-full text-3xl transition-all duration-200 ${isSelected ? 'bg-[var(--accent-primary)] scale-110' : 'bg-black/20 hover:bg-black/40'}`;

  const fetchMoodHistory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/mood');
      if (res.ok) {
        const data = await res.json();
        setMoodHistory(data.data);
      } else {
        setError('Failed to fetch mood history.');
      }
    } catch (err) {
      setError('An error occurred while fetching mood history.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMoodHistory();
  }, []);

  const handleMoodSelect = async (moodEmoji: string) => {
    setError('');
    setSelectedMood(moodEmoji);
    setSuggestion('');
    setSuggestion('');
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingTodayMood = moodHistory.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0,0,0,0);
      return entryDate.getTime() === today.getTime();
    });

    if (existingTodayMood) {
      setError('Mood already recorded for today. You can only record once per day.');
      setSelectedMood(existingTodayMood.mood);
      return;
    }

    try {
      const res = await fetch('/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mood: moodEmoji, date: today.toISOString() }),
      });

      if (res.ok) {
        fetchMoodHistory(); // Refresh history
        setIsSuggestionLoading(true);
        try {
          const suggestionRes = await fetch('/api/mood/suggestion', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mood: moodEmoji }),
          });
          if (suggestionRes.ok) {
            const data = await suggestionRes.json();
            setSuggestion(data.suggestion);
          }
        } catch (err) {
          // Silently fail on suggestion error
        } finally {
          setIsSuggestionLoading(false);
        }
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to record mood.');
      }
    } catch (err) {
      setError('An error occurred while recording mood.');
    }
  };

  const getMoodForDate = (date: Date) => {
    const targetDate = new Date(date);
    targetDate.setHours(0,0,0,0);
    return moodHistory.find(entry => {
      const entryDate = new Date(entry.date);
      entryDate.setHours(0,0,0,0);
      return entryDate.getTime() === targetDate.getTime();
    });
  };

  const renderMoodHistory = () => {
    const historyDays = [];
    for (let i = 6; i >= 0; i--) { // Last 7 days
      const d = new Date();
      d.setDate(d.getDate() - i);
      const moodForDay = getMoodForDate(d);
      const moodEmoji = moodForDay ? moodForDay.mood : '⚪'; // Default for no mood
      historyDays.push(
        <div key={d.toISOString()} className="flex flex-col items-center">
          <span className="text-xl">{moodEmoji}</span>
          <span className="text-xs text-[var(--text-secondary)]">{d.toLocaleDateString('en-US', { weekday: 'short' })}</span>
        </div>
      );
    }
    return historyDays;
  };

  return (
    <div className={cardClasses}>
      <div className="flex-grow">
        <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">How are you feeling today?</h2>
        {error && <p className="bg-red-500/30 text-red-200 p-3 rounded-lg mb-4 border border-red-400/50">{error}</p>}

        <div className="flex flex-wrap justify-center gap-3 mb-6">
          {moods.map((moodOption) => (
            <button
              key={moodOption.emoji}
              onClick={() => handleMoodSelect(moodOption.emoji)}
              className={buttonClasses(selectedMood === moodOption.emoji)}
              title={moodOption.name}
            >
              {moodOption.emoji}
            </button>
          ))}
        </div>

        {isSuggestionLoading && <p className="text-center text-[var(--text-secondary)] mt-4">Getting AI suggestion...</p>}
        {suggestion && !isSuggestionLoading && (
          <div className="mt-6 p-4 bg-black/20 rounded-lg border border-[var(--border-color)]">
            <h4 className="font-bold text-lg text-[var(--accent-secondary)] mb-2 flex items-center gap-2">
              💡 AI Suggestion
            </h4>
            <p className="text-[var(--text-secondary)]">{suggestion}</p>
          </div>
        )}
      </div>

      <div className="mt-auto pt-6">
        <h3 className="text-xl font-semibold mb-3 text-[var(--text-primary)]">Last 7 Days</h3>
        {isLoading ? (
          <p className="text-[var(--text-secondary)]">Loading mood history...</p>
        ) : (
          <div className="flex justify-around items-center bg-black/20 rounded-lg p-3 border border-[var(--border-color)]">
            {renderMoodHistory()}
          </div>
        )}
      </div>
    </div>
  );
}
