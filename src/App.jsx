import { useState, useEffect } from 'react';

function App() {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [timestamp, setTimestamp] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [copiedFormats, setCopiedFormats] = useState({});
  const [alertMessage, setAlertMessage] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (date && time) {
      const dateTime = new Date(`${date}T${time}`);
      setTimestamp(Math.floor(dateTime.getTime() / 1000));
      setIsCopied(false); // Reset copied state
      setCopiedFormats({});
      setAlertMessage(''); // Clear any previous alert messages
    } else {
        setAlertMessage('Please select a date and time.');
    }
  };

  const handleCopy = () => {
    
    navigator.clipboard.writeText(timestamp).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  const handleNow = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
    setTime(`${hours}:${minutes}`);
  };

  const handleFormatCopy = (format) => {
    navigator.clipboard.writeText(`<t:${timestamp}:${format}>`).then(() => {
      setCopiedFormats(prev => ({ ...prev, [format]: true }));
      setTimeout(() => setCopiedFormats(prev => ({ ...prev, [format]: false })), 2000);
    });
  };

  const formatDate = (timestamp, format) => {
    const date = new Date(timestamp * 1000);
    switch (format) {
      case 'd':
        return date.toLocaleDateString();
      case 'D':
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
      case 't':
        return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      case 'T':
        return date.toLocaleTimeString();
      case 'f':
        return date.toLocaleString(undefined, { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      case 'F':
        return date.toLocaleString(undefined, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
      case 'R':
        const seconds = Math.floor((new Date() - date) / 1000);
        const future = seconds < 0;
        const secondsAbs = Math.abs(seconds);
        let interval = secondsAbs / 31536000;
        if (interval > 1) return future ? `in ${Math.floor(interval)} years` : `${Math.floor(interval)} years ago`;
        interval = secondsAbs / 2592000;
        if (interval > 1) return future ? `in ${Math.floor(interval)} months` : `${Math.floor(interval)} months ago`;
        interval = secondsAbs / 86400;
        if (interval > 1) return future ? `in ${Math.floor(interval)} days` : `${Math.floor(interval)} days ago`;
        interval = secondsAbs / 3600;
        if (interval > 1) return future ? `in ${Math.floor(interval)} hours` : `${Math.floor(interval)} hours ago`;
        interval = secondsAbs / 60;
        if (interval > 1) return future ? `in ${Math.floor(interval)} minutes` : `${Math.floor(interval)} minutes ago`;
        return future ? `in ${Math.floor(secondsAbs)} seconds` : `${Math.floor(secondsAbs)} seconds ago`;
      default:
        return '';
    }
  };

  useEffect(() => {
    handleNow();
  }, []);

  useEffect(() => {
    if (date && time) {
      handleSubmit({ preventDefault: () => {} });
    }
  }, [date, time]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl mx-auto p-8">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-h-fit md:col-span-1">
          <h1 className="text-4xl font-bold text-center mb-6">Unix Timestamp Converter</h1>
          {alertMessage && (
            <div className="border-red-500 border text-red-500 p-4 rounded mb-4">
              {alertMessage}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-2">Date</label>
              <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-300 mb-2">Time</label>
              <input type="time" id="time" value={time} onChange={(e) => setTime(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="button" onClick={handleNow} className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-md transition duration-300">
              Use Current Time
            </button>
            <p className="text-sm text-gray-400 mt-2">Select a date and time to automatically generate the Unix timestamp.</p>
            
          </form>
        </div>
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-h-fit md:col-span-2">
          <div className="mt-8 p-4 bg-gray-700 rounded-lg text-center">
            <h2 className="text-2xl font-semibold">Unix Timestamp:</h2>
            <p className="text-3xl font-bold text-green-400 mt-2">{timestamp || '...'}</p>
            <button onClick={handleCopy} disabled={!timestamp} className="mt-4 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="mt-8 p-4 bg-gray-700 rounded-lg text-center">
            <h2 className="text-2xl font-semibold">All Discord Timestamps:</h2>
            <div className="space-y-4 mt-4">
              {[
                { format: 'd', label: 'Short Date' },
                { format: 'D', label: 'Long Date' },
                { format: 't', label: 'Short Time' },
                { format: 'T', label: 'Long Time' },
                { format: 'f', label: 'Short Date/Time' },
                { format: 'F', label: 'Long Date/Time' },
                { format: 'R', label: 'Relative Time' },
              ].map(({ format, label }) => (
                <div key={format} className="flex items-center justify-between bg-gray-600 p-2 rounded-md">
                  <div className="text-left">
                    <p className="text-lg">{timestamp ? `<t:${timestamp}:${format}> (${label})` : '...'}</p>
                    <p className="text-sm text-gray-400">{timestamp ? formatDate(timestamp, format) : '...'}</p>
                  </div>
                  <button onClick={() => handleFormatCopy(format)} disabled={!timestamp} className="bg-gray-500 hover:bg-gray-400 text-white font-bold py-1 px-3 rounded-md transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    {copiedFormats[format] ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
