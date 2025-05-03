import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

export default function BasicAudioMvp() {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleGenerateLesson = async () => {
    if (!topic.trim()) {
      setErrorMessage('Please enter a topic');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    
    try {
      const response = await fetch('/api/audio/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.trim() })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate lesson');
      }
      
      setTranscript(data.transcript || '');
      
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Error generating lesson');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Audio Tutor</h1>
      
      <div className="max-w-xl mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <label htmlFor="topic" className="block mb-2">Enter a topic:</label>
          <input
            id="topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
            placeholder="What is chemistry?"
          />
        </div>
        
        <button
          onClick={handleGenerateLesson}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Lesson'}
        </button>
        
        {errorMessage && (
          <div className="mt-4 p-3 bg-red-900 text-white rounded">
            {errorMessage}
          </div>
        )}
        
        {transcript && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Transcript:</h2>
            <div className="p-4 bg-gray-800 rounded whitespace-pre-wrap">
              {transcript}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
