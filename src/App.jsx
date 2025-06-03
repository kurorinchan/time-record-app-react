import React, { useState, useEffect } from 'react';

// Main App component for the time recording application
function App() {
  // State to hold the current date and time, updated every second
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // State to hold the list of recorded times, limited to the 5 latest.
  // Each item is now an object: { formattedTime: string, timestamp: number, emoji: string }
  const [recordedTimes, setRecordedTimes] = useState([]);
  // State to hold the calculated elapsed time strings for ALL records
  const [allElapsedTimes, setAllElapsedTimes] = useState([]);
  // New state to hold the currently selected emoji for the next recording
  const [selectedEmoji, setSelectedEmoji] = useState('🍔'); // Default emoji changed to '🍔'

  // Define a list of emojis for selection
  const emojis = ['🍔', '✨', '🍕', '🎮', '💡', '🚀', '📚', '💤']; // Food and game emojis included!

  // Helper function to format a number with a leading zero if it's a single digit
  const formatTwoDigits = (num) => String(num).padStart(2, '0');

  // useEffect hook to manage the real-time clock display
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // NEW: useEffect hook to update the document title with the current time
  useEffect(() => {
    const hours = formatTwoDigits(currentDateTime.getHours());
    const minutes = formatTwoDigits(currentDateTime.getMinutes());
    // Changed the order to HH:MM - Time Recorder App
    document.title = `${hours}:${minutes} - Time Recorder App`;
  }, [currentDateTime]); // Re-run this effect whenever currentDateTime changes

  // useEffect hook to load recorded times from localStorage when the component mounts
  useEffect(() => {
    try {
      const storedTimes = localStorage.getItem('recordedTimes');
      const parsedTimes = storedTimes ? JSON.parse(storedTimes) : [];
      // Ensure loaded records have an emoji property, default if missing (for old records)
      const sanitizedTimes = parsedTimes.map(record => ({
        ...record,
        emoji: record.emoji || '✨' // Default to '✨' if emoji is undefined
      }));
      setRecordedTimes(sanitizedTimes);
    } catch (error) {
      console.error("Failed to load recorded times from localStorage:", error);
      setRecordedTimes([]);
    }
  }, []);

  // useEffect hook to calculate and update the elapsed time for ALL records
  useEffect(() => {
    if (recordedTimes.length > 0) {
      const nowMs = currentDateTime.getTime();

      const newElapsedTimes = recordedTimes.map(record => {
        const diffMs = nowMs - record.timestamp;
        if (diffMs < 0) return '00 h 00 m';

        const totalMinutes = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;

        const formattedHours = formatTwoDigits(diffHours);
        const formattedMinutes = formatTwoDigits(remainingMinutes);

        return `${formattedHours} h ${formattedMinutes} m`;
      });
      setAllElapsedTimes(newElapsedTimes);
    } else {
      setAllElapsedTimes([]);
    }
  }, [currentDateTime, recordedTimes]);

  // Function to handle the "Record Time" button click
  const recordTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = formatTwoDigits(now.getMonth() + 1);
    const day = formatTwoDigits(now.getDate());
    const hours = formatTwoDigits(now.getHours());
    const minutes = formatTwoDigits(now.getMinutes());
    const seconds = formatTwoDigits(now.getSeconds());

    const formattedTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    // Create a new record object including the selected emoji
    const newRecord = {
      formattedTime: formattedTime,
      timestamp: now.getTime(),
      emoji: selectedEmoji // Include the currently selected emoji
    };

    const updatedTimes = [newRecord, ...recordedTimes].slice(0, 5);
    setRecordedTimes(updatedTimes);

    try {
      localStorage.setItem('recordedTimes', JSON.stringify(updatedTimes));
    } catch (error) {
      console.error("Failed to save recorded times to localStorage:", error);
    }
  };

  // New function to clear all recorded times from state and localStorage
  const clearRecordedTimes = () => {
    if (window.confirm("Are you sure you want to clear all recorded times?")) {
      localStorage.removeItem('recordedTimes');
      setRecordedTimes([]);
      setAllElapsedTimes([]); // Clear elapsed times display as well
    }
  };

  // New function to handle emoji change in the table dropdown
  const handleEmojiChange = (index, newEmoji) => {
    // Create a new array to avoid direct mutation of state
    const updatedRecords = recordedTimes.map((record, i) =>
      i === index ? { ...record, emoji: newEmoji } : record
    );
    setRecordedTimes(updatedRecords); // Update React state

    try {
      localStorage.setItem('recordedTimes', JSON.stringify(updatedRecords)); // Update localStorage
    } catch (error) {
      console.error("Failed to update emoji in localStorage:", error);
    }
  };

  return (
    // Changed max-w-md to max-w-2xl for a wider container
    <div className="min-h-screen bg-gray-900 flex flex-col items-start justify-start p-4 font-inter">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-2xl"> {/* Wider container */}
        <h1 className="text-2xl font-semibold text-gray-100 mb-4 text-center">
          Current Date and Time:
        </h1>
        <p className="text-3xl font-bold text-blue-400 mb-6 text-center font-mono">
          {currentDateTime.toLocaleString()}
        </p>

        {/* Emoji selection buttons */}
        <div className="flex flex-wrap justify-center gap-2 mt-4 mb-6"> {/* Added gap-2 for spacing */}
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => setSelectedEmoji(emoji)}
              className={`p-3 text-2xl rounded-full ${selectedEmoji === emoji ? 'bg-blue-600 ring-2 ring-blue-400' : 'bg-gray-700 hover:bg-gray-600'} transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75`}
              aria-label={`Select ${emoji} emoji`}
            >
              {emoji}
            </button>
          ))}
        </div>

        <button
          onClick={recordTime}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Record Time
        </button>

        <h2 className="text-xl font-semibold text-gray-100 mt-8 mb-4 text-center">
          Recorded Times (Latest 5):
        </h2>
        {recordedTimes.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-700 border border-gray-600 rounded-lg overflow-hidden">
              <thead className="bg-gray-600">
                <tr>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b border-gray-600">
                    Timestamp
                  </th>
                  <th className="py-3 px-4 text-left text-sm font-medium text-gray-200 uppercase tracking-wider border-b border-gray-600">
                    Elapsed
                  </th>
                  {/* New table header for Emoji Note */}
                  <th className="py-3 px-4 text-center text-sm font-medium text-gray-200 uppercase tracking-wider border-b border-gray-600">
                    Note
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {recordedTimes.map((record, index) => (
                  <tr key={record.timestamp} className="hover:bg-gray-600"><td className="py-3 px-4 whitespace-nowrap text-gray-200 text-base font-mono">
                    {record.formattedTime}
                  </td>
                    <td className="py-3 px-4 whitespace-nowrap text-gray-200 text-base font-mono">
                      {allElapsedTimes[index]}
                    </td>
                    {/* Display the emoji as a dropdown menu */}
                    <td className="py-3 px-4 whitespace-nowrap text-gray-200 text-base font-mono text-center">
                      <select
                        value={record.emoji}
                        onChange={(e) => handleEmojiChange(index, e.target.value)}
                        className="bg-gray-700 border border-gray-600 text-gray-200 text-base rounded-md p-1 focus:ring-blue-400 focus:border-blue-400 font-sans"
                        aria-label="Edit emoji note"
                      >
                        {emojis.map((emojiOption) => (
                          <option key={emojiOption} value={emojiOption}>
                            {emojiOption}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-400 text-center">No times recorded yet.</p>
        )}

        {/* New button to clear recorded times */}
        {recordedTimes.length > 0 && ( // Only show if there are records
          <button
            onClick={clearRecordedTimes}
            className="mt-6 w-full py-3 px-6 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Clear All Records
          </button>
        )}
      </div>
    </div>
  );
}

export default App;
