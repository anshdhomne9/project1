
'use client';

import { useState, useEffect } from 'react';

interface CalendarEvent {
  _id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay: boolean;
  createdAt: string;
}

export default function EventList() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDescription, setNewEventDescription] = useState('');
  const [newEventStartTime, setNewEventStartTime] = useState('');
  const [newEventEndTime, setNewEventEndTime] = useState('');
  const [newEventAllDay, setNewEventAllDay] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const cardClasses = "bg-[var(--card-background)] backdrop-blur-lg rounded-2xl shadow-2xl border border-[var(--border-color)] p-6";
  const inputClasses = "w-full px-4 py-2 text-[var(--text-primary)] bg-black/20 rounded-lg border border-[var(--border-color)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-primary)] transition";
  const buttonClasses = (accent: 'primary' | 'secondary' | 'red') => `px-4 py-2 font-semibold text-white rounded-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-transform duration-200 hover:scale-105 ${accent === 'red' ? 'bg-red-600' : accent === 'primary' ? 'bg-[var(--accent-primary)]' : 'bg-[var(--accent-secondary)]'}`;

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        setEvents(data.data);
      } else {
        setError('Failed to fetch events.');
      }
    } catch (err) {
      setError('An error occurred while fetching events.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!newEventTitle || !newEventStartTime || !newEventEndTime) {
      setError('Title, start time, and end time are required.');
      return;
    }

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newEventTitle,
          description: newEventDescription,
          startTime: new Date(newEventStartTime).toISOString(),
          endTime: new Date(newEventEndTime).toISOString(),
          allDay: newEventAllDay,
        }),
      });

      if (res.ok) {
        setNewEventTitle('');
        setNewEventDescription('');
        setNewEventStartTime('');
        setNewEventEndTime('');
        setNewEventAllDay(false);
        fetchEvents(); // Refresh the list
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to add event.');
      }
    } catch (err) {
      setError('An error occurred while adding the event.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchEvents(); // Refresh the list
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to delete event.');
      }
    } catch (err) {
      setError('An error occurred while deleting the event.');
    }
  };

  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(); // Adjust format as needed
  };

  return (
    <div className="space-y-8">
      <div className={cardClasses}>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Add New Event</h2>
        <form onSubmit={handleAddEvent} className="space-y-4">
          <input type="text" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} placeholder="Event Title" className={inputClasses} required />
          <textarea value={newEventDescription} onChange={(e) => setNewEventDescription(e.target.value)} placeholder="Event Description (optional)" className={inputClasses}></textarea>
          <label className="block text-[var(--text-secondary)] text-sm font-medium">Start Time:</label>
          <input type="datetime-local" value={newEventStartTime} onChange={(e) => setNewEventStartTime(e.target.value)} className={inputClasses} required />
          <label className="block text-[var(--text-secondary)] text-sm font-medium">End Time:</label>
          <input type="datetime-local" value={newEventEndTime} onChange={(e) => setNewEventEndTime(e.target.value)} className={inputClasses} required />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="allDay" checked={newEventAllDay} onChange={(e) => setNewEventAllDay(e.target.checked)} className="h-4 w-4 text-[var(--accent-primary)] border-gray-300 rounded focus:ring-[var(--accent-primary)]" />
            <label htmlFor="allDay" className="text-[var(--text-secondary)]">All Day Event</label>
          </div>
          <button type="submit" className={buttonClasses('primary')}>Add Event</button>
        </form>
      </div>

      <div className={cardClasses}>
        <h2 className="text-2xl font-semibold mb-4 text-[var(--text-primary)]">Your Events</h2>
        {error && <p className="bg-red-500/30 text-red-200 p-3 rounded-lg mb-4 border border-red-400/50">{error}</p>}
        {isLoading ? (
          <p className="text-[var(--text-secondary)]">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No events found. Add one above!</p>
        ) : (
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event._id} className="bg-black/20 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between transition-all duration-200 hover:bg-black/40">
                <div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)]">{event.title}</h3>
                  {event.description && <p className="text-[var(--text-secondary)] text-sm">{event.description}</p>}
                  <p className="text-[var(--text-secondary)] text-xs mt-1">
                    {event.allDay ? 'All Day' : `${formatDateTime(event.startTime)} - ${formatDateTime(event.endTime)}`}
                  </p>
                </div>
                <button onClick={() => handleDeleteEvent(event._id)} className={`${buttonClasses('red')} mt-3 md:mt-0 md:ml-4`}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
