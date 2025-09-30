
'use client';

import { useMemo } from 'react';

const quotes = [
  { q: "The best way to predict the future is to create it.", a: "Peter Drucker" },
  { q: "Your time is limited, so don’t waste it living someone else’s life.", a: "Steve Jobs" },
  { q: "The only way to do great work is to love what you do.", a: "Steve Jobs" },
  { q: "Success is not final, failure is not fatal: it is the courage to continue that counts.", a: "Winston Churchill" },
  { q: "The journey of a thousand miles begins with a single step.", a: "Lao Tzu" },
  { q: "Believe you can and you're halfway there.", a: "Theodore Roosevelt" },
  { q: "It does not matter how slowly you go as long as you do not stop.", a: "Confucius" },
  { q: "Everything you’ve ever wanted is on the other side of fear.", a: "George Addair" }
];

export default function Quote() {
  // useMemo ensures we get a new quote on refresh, but not on every re-render within the same session.
  // The dependency array is empty, so it runs once on component mount.
  const quote = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }, []);

  return (
    <div className="bg-[var(--card-background)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[var(--border-color)] p-6">
      <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Quote of the Day</h2>
      <blockquote className="relative">
        <p className="text-lg italic text-[var(--text-secondary)]">"{quote.q}"</p>
        <footer className="mt-2 text-right text-[var(--text-secondary)]">- {quote.a}</footer>
      </blockquote>
    </div>
  );
}
