
import React, { useState, useEffect } from 'react';

// FIX: Removed the conflicting `declare global` block for `window.aistudio`.
// The TypeScript compiler error indicates that `window.aistudio` is already
// defined in another global declaration, making this one redundant and causing a type clash.

interface AuthProps {
  onLoginSuccess: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkKey = async () => {
      // Check if aistudio object and methods exist
      if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
        if (await window.aistudio.hasSelectedApiKey()) {
          onLoginSuccess();
        } else {
          setIsChecking(false);
        }
      } else {
        // Fallback for environments where aistudio is not available
        console.warn("aistudio API not found. Skipping API key check.");
        onLoginSuccess(); 
      }
    };
    // Give a brief moment for the aistudio object to initialize
    setTimeout(checkKey, 100);
  }, [onLoginSuccess]);

  const handleSelectKey = async () => {
    if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
      try {
        await window.aistudio.openSelectKey();
        // Optimistically assume success and let the app proceed.
        // A failed API call will bring the user back here.
        onLoginSuccess();
      } catch (e) {
        console.error("Error opening API key selection:", e);
        alert("Could not open the API key selection dialog.");
      }
    } else {
      alert("API key selection is not available in this environment.");
    }
  };

  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-600 border-dashed rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking API Key status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-lg border border-gray-200/80 text-center">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          ARTEFACTO
        </h1>
        <h2 className="text-xl font-semibold text-gray-700">
          Welcome to the Workshop
        </h2>
        <p className="text-gray-600">
          To begin, please select a Google AI API key. This key will be used to make requests to the Gemini API for the image and video analysis exercises.
        </p>
        <p className="text-sm text-gray-500">
          Please note that usage of the Gemini API may incur costs. For more information, please see the{' '}
          <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            billing documentation
          </a>.
        </p>
        <div>
          <button
            onClick={handleSelectKey}
            className="w-full max-w-xs mx-auto py-3 px-4 bg-black text-white font-bold rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-300"
          >
            Select API Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;