
import React, { useState } from 'react';

interface Message {
    text: string;
    type: 'success' | 'error';
}

const Settings: React.FC = () => {
  const [message, setMessage] = useState<Message | null>(null);

  const handleSelectKey = async () => {
    setMessage(null);
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      try {
        await window.aistudio.openSelectKey();
        setMessage({ text: 'API Key has been successfully updated. You can now use the analysis tools.', type: 'success'});
      } catch (e) {
        console.error("Error opening API key selection:", e);
        setMessage({ text: "Could not open the API key selection dialog. Please try again.", type: 'error'});
      }
    } else {
      setMessage({ text: "API key selection is not available in this environment.", type: 'error'});
    }
  };

  return (
    <div className="bg-gray-50/80 border border-gray-200 p-6 rounded-lg max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">API Key Settings</h3>
      <p className="text-gray-600 mb-6">
        Use the button below to select or change your Google AI API key. A valid key is required for the image and video analysis features to function.
      </p>
      
      <div className="text-center">
        <button
          onClick={handleSelectKey}
          className="w-full max-w-xs mx-auto py-3 px-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300"
        >
          Select / Change API Key
        </button>
      </div>

      {message && (
        <p className={`mt-4 text-center text-sm ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {message.text}
        </p>
      )}

      <p className="text-sm text-gray-500 mt-8 text-center">
          Please note that usage of the Gemini API may incur costs. For more information, please see the{' '}
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            billing documentation
          </a>.
      </p>
    </div>
  );
};

export default Settings;
