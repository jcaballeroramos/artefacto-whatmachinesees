import React, { useState, useRef, useCallback } from 'react';
import { analyzeVideoAndStartChat, sendMessageToChat, VideoAnalysisEvent } from '../services/geminiService';
import { extractFramesFromVideo } from '../utils/fileUtils';
import Loader from './Loader';
import AnalysisDisplay from './AnalysisDisplay';
import ChatInterface from './ChatInterface';
import { Chat } from '@google/genai';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

const VideoAnalyzer: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [events, setEvents] = useState<VideoAnalysisEvent[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    
    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('video/')) {
                setError('Please select a valid video file.');
                return;
            }
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setAnalysis(null);
            setEvents([]);
            setError(null);
            setChatSession(null);
            setChatHistory([]);
        }
    };
    
    const handleAnalyzeClick = useCallback(async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        setAnalysis(null);
        setEvents([]);
        setError(null);
        setChatSession(null);
        setChatHistory([]);

        try {
            setLoadingMessage('Extracting frames from video...');
            const frames = await extractFramesFromVideo(selectedFile, 15);
            
            setLoadingMessage('Analyzing frames with AI...');
            const result = await analyzeVideoAndStartChat(frames);
            setAnalysis(result.analysis);
            setEvents(result.events);
            setChatSession(result.chat);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during video processing.';
            setError(`Failed to analyze video. ${errorMessage}`);
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [selectedFile]);

    const triggerFileSelect = () => fileInputRef.current?.click();

    const handleTimestampClick = (time: number) => {
        if (videoRef.current) {
            videoRef.current.currentTime = time;
            videoRef.current.play();
            videoRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim() || !chatSession || isChatLoading) return;

        const userMessage = chatInput;
        setChatHistory(prev => [...prev, { role: 'user', text: userMessage }]);
        setChatInput('');
        setIsChatLoading(true);

        try {
            const modelResponse = await sendMessageToChat(chatSession, userMessage);
            setChatHistory(prev => [...prev, { role: 'model', text: modelResponse }]);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
            setChatHistory(prev => [...prev, { role: 'model', text: `Sorry, I encountered an error: ${errorMessage}` }]);
        } finally {
            setIsChatLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                {/* Left Side: Upload & Preview */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">1. Upload your video</h3>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="video/*"
                        className="hidden"
                    />
                    <button
                        onClick={triggerFileSelect}
                        className="w-full border border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                    >
                        {selectedFile ? 'Change video' : 'Select video'}
                    </button>

                    {previewUrl && (
                        <div className="mt-4 p-2 border border-gray-200 rounded-lg bg-gray-50/50">
                            <video ref={videoRef} src={previewUrl} controls className="max-w-full max-h-96 mx-auto rounded-md" />
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
                                {isLoading ? 'Analyzing...' : '2. Analyze video'}
                            </button>
                        </div>
                    )}
                </div>

                {/* Right Side: Analysis & Chat */}
                <div className="md:sticky md:top-24 space-y-4">
                    <h3 className="text-xl font-semibold text-gray-800 border-b border-gray-200 pb-2">3. Machine's perspective</h3>
                     <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg max-h-[calc(100vh-10rem)] overflow-y-auto">
                        {isLoading && <Loader message={loadingMessage} />}
                        {error && <p className="text-red-600">Error: {error}</p>}
                        
                        {analysis && <AnalysisDisplay text={analysis} />}

                        {events.length > 0 && !isLoading && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 border-t border-gray-200 pt-4 mb-2">Key moments</h4>
                                <ul className="space-y-2">
                                    {events.map((event, index) => (
                                        <li key={index}>
                                            <button 
                                                onClick={() => handleTimestampClick(event.timestamp)}
                                                className="text-left w-full p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            >
                                                <span className="font-semibold text-black">{event.timeString}</span>
                                                <span className="ml-2 text-gray-600">{event.description}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {!isLoading && !analysis && !error && (
                            <p className="text-gray-400 italic pt-2">Analysis will appear here once you upload a video and click analyze.</p>
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

export default VideoAnalyzer;