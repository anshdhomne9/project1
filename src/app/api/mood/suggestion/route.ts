import { NextResponse } from 'next/server';

// Predefined "AI" suggestions for different moods
const moodSuggestions: { [key: string]: string } = {
  '😄': "That's great to hear! Channel this positive energy into something creative or a fun activity.",
  '😊': "Feeling content is a wonderful state. It's a perfect time for a relaxing walk or to enjoy a good book.",
  '😐': "A neutral day is a blank canvas. Why not plan something exciting for the weekend or learn something new?",
  '😔': "It's okay to feel sad. Consider listening to some uplifting music, talking to a friend, or watching a comfort movie.",
  '😡': "Feeling angry can be tough. A short, intense workout, deep breathing exercises, or writing down your thoughts can help.",
  '😴': "Your body is asking for rest. Try to get an early night, take a short power nap, or do some gentle stretching.",
  '🤩': "Excitement is a powerful motivator! It's a great time to start that new project you've been thinking about.",
};

export async function POST(request: Request) {
  try {
    const { mood } = await request.json();

    if (!mood || typeof mood !== 'string') {
      return NextResponse.json({ message: 'Mood is required.' }, { status: 400 });
    }

    const suggestion = moodSuggestions[mood] || "Whatever you're feeling, remember to be kind to yourself. Every day is a new opportunity.";

    return NextResponse.json({ suggestion });

  } catch (error) {
    return NextResponse.json({ message: 'An error occurred while generating a suggestion.' }, { status: 500 });
  }
}
