import React, { useState, useRef, useCallback } from 'react';
import { analyzeImageAndStartChat, sendMessageToChatStream } from '../services/geminiService';
import { fileToBase64 } from '../utils/fileUtils';
import Loader from './Loader';
import AnalysisDisplay from './AnalysisDisplay';
import ChatInterface from './ChatInterface';
import { Chat } from '@google/genai';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const ImageAnalyzer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setAnalysis(null);
      setError(null);
      setChatSession(null);
      setChatHistory([]);
    }
  };

  const handleAnalyzeClick = useCallback(async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setAnalysis(null);
    setError(null);
    setChatSession(null);
    setChatHistory([]);

    try {
      const base64Data = await fileToBase64(selectedFile);
      const result = await analyzeImageAndStartChat({
        mimeType: selectedFile.type,
        data: base64Data,
      });
      setAnalysis(result.analysis);
      setChatSession(result.chat);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedFile]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !chatSession || isChatLoading) return;

    const userMessage = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');
    setIsChatLoading(true);
    
    // Add a placeholder for the model's streaming response
    setChatHistory(prev => [...prev, { role: 'model', text: '' }]);

    try {
        const stream = await sendMessageToChatStream(chatSession, userMessage);
        let responseText = '';
        for await (const chunk of stream) {
            responseText += chunk.text;
            // Update the last message (the model's response) in the history
            setChatHistory(prev => {
                const newHistory = [...prev];
                newHistory[newHistory.length - 1] = { role: 'model', text: responseText };
                return newHistory;
            });
        }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
        setChatHistory(prev => {
            const newHistory = [...prev];
            newHistory[newHistory.length - 1] = { role: 'model', text: `Sorry, I encountered an error: ${errorMessage}` };
            return newHistory;
        });
    } finally {
        setIsChatLoading(false);
    }
  };

  const handleExport = () => {
    if (!analysis) return;
    const exportData = {
        analysis,
    };
    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `image-analysis-${selectedFile?.name.split('.').slice(0, -1).join('.') || 'export'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Side: Upload & Preview */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">1. Upload your image</h3>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={triggerFileSelect}
            className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
          >
            {selectedFile ? 'Change image' : 'Select image'}
          </button>
          
          {previewUrl && (
            <div className="mt-4 p-2 border border-gray-200 rounded-lg bg-gray-50/50">
              <img src={previewUrl} alt="Selected preview" className="max-w-full max-h-96 mx-auto rounded-md object-contain" />
            </div>
          )}

          {selectedFile && (
             <div className="text-center pt-2">
                <p className="text-sm text-gray-500 truncate" title={selectedFile.name}>File: {selectedFile.name}</p>
                <button
                    onClick={handleAnalyzeClick}
                    disabled={isLoading}
                    className="mt-4 w-full bg-black text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-300"
                >
                    {isLoading ? 'Analyzing...' : '2. Analyze image'}
                </button>
             </div>
          )}
        </div>

        {/* Right Side: Analysis */}
        <div className="space-y-4 min-h-[20rem]">
          <div className="flex justify-between items-center border-b border-gray-200 pb-2">
            <h3 className="text-xl font-semibold text-gray-800">3. Machine's perspective</h3>
            {analysis && !isLoading && (
              <button
                onClick={handleExport}
                className="text-sm bg-gray-200 text-gray-800 font-semibold py-1 px-3 rounded-md hover:bg-gray-300 transition-colors"
              >
                Export Results
              </button>
            )}
          </div>
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg h-full min-h-[28rem] overflow-y-auto">
            {isLoading && <Loader />}
            {error && <p className="text-red-600">Error: {error}</p>}
            <AnalysisDisplay text={analysis} />
            {!isLoading && !analysis && !error && (
              <p className="text-gray-400 italic pt-2">Analysis will appear here once you upload an image and click analyze.</p>
            )}
             {chatSession && (
                <ChatInterface
                    history={chatHistory}
                    inputValue={chatInput}
                    onInputChange={(e) => setChatInput(e.target.value)}
                    onSendMessage={handleSendMessage}
                    isLoading={isChatLoading}
                />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzer;