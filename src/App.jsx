import React, { useState, useEffect } from 'react';

// Main App component for the time recording application
function App() {
  // State to hold the current date and time, updated every second
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  // State to hold the list of recorded times, limited to the 5 latest
  const [recordedTimes, setRecordedTimes] = useState([]);

  // useEffect hook to manage the real-time clock display
  useEffect(() => {
    // Set up an interval to update the current date and time every 1000 milliseconds (1 second)
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Cleanup function: This runs when the component unmounts or before the effect re-runs.
    // It clears the interval to prevent memory leaks and ensure efficient resource usage.
    return () => clearInterval(timer);
  }, []); // Empty dependency array means this effect runs once on mount and cleans up on unmount

  // useEffect hook to load recorded times from localStorage when the component mounts
  useEffect(() => {
    try {
      // Attempt to retrieve 'recordedTimes' from localStorage
      const storedTimes = localStorage.getItem('recordedTimes');
      // If data exists, parse it from JSON string back to a JavaScript array.
      // If no data, default to an empty array.
      const parsedTimes = storedTimes ? JSON.parse(storedTimes) : [];
      setRecordedTimes(parsedTimes);
    } catch (error) {
      // Log any errors that occur during localStorage access (e.g., malformed JSON)
      console.error("Failed to load recorded times from localStorage:", error);
      setRecordedTimes([]); // Ensure recordedTimes is an empty array on error
    }
  }, []); // Empty dependency array means this effect runs once on mount

  // Function to handle the "Record Time" button click
  const recordTime = () => {
    // Get the current date and time in a localized string format
    const newRecordedTime = new Date().toLocaleString();

    // Create a new array:
    // 1. Add the `newRecordedTime` to the beginning.
    // 2. Spread the existing `recordedTimes` after it.
    // 3. Use `.slice(0, 5)` to ensure only the 5 most recent records are kept.
    const updatedTimes = [newRecordedTime, ...recordedTimes].slice(0, 5);

    // Update the component's state with the new list of recorded times
    setRecordedTimes(updatedTimes);

    try {
      // Save the updated list to localStorage.
      // localStorage only stores strings, so we convert the array to a JSON string.
      localStorage.setItem('recordedTimes', JSON.stringify(updatedTimes));
    } catch (error) {
      // Log any errors that occur during localStorage write (e.g., storage full)
      console.error("Failed to save recorded times to localStorage:", error);
    }
  };

  return (
    // Removed `justify-center` and `items-center` for top-left alignment
    // Added `justify-start` and `items-start`
    <div className="min-h-screen bg-gray-900 flex flex-col items-start justify-start p-4 font-inter">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        {/* Section for displaying current date and time */}
        <h1 className="text-2xl font-semibold text-gray-100 mb-4 text-center">
          Current Date and Time:
        </h1>
        <p className="text-3xl font-bold text-blue-400 mb-6 text-center">
          {currentDateTime.toLocaleString()}
        </p>

        {/* Button to record the current time */}
        <button
          onClick={recordTime}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-semibold rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition duration-300 ease-in-out transform hover:scale-105"
        >
          Record Time
        </button>

        {/* Section for displaying recorded times */}
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
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {/* Map through the recordedTimes array to display each timestamp in a table row */}
                {recordedTimes.map((time, index) => (
                  <tr key={index} className="hover:bg-gray-600">
                    <td className="py-3 px-4 whitespace-nowrap text-gray-200 text-base">
                      {time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          // Message displayed if no times have been recorded yet
          <p className="text-gray-400 text-center">No times recorded yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
