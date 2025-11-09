
import React, { useState, useRef, useCallback } from 'react';
import { analyzeVideoAndStartChat, sendMessageToChatStream, VideoAnalysisEvent, KeyPerson, TechnicalDescription, TaxonomyClassification } from '../services/geminiService';
import { extractFramesFromVideo } from '../utils/fileUtils';
import Loader from './Loader';
import AnalysisDisplay from './AnalysisDisplay';
import ChatInterface from './ChatInterface';
import { Chat } from '@google/genai';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface VideoAnalyzerProps {
    onApiKeyError: () => void;
}

const VideoAnalyzer: React.FC<VideoAnalyzerProps> = ({ onApiKeyError }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [events, setEvents] = useState<VideoAnalysisEvent[]>([]);
    const [keyPeople, setKeyPeople] = useState<KeyPerson[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    
    const [synopsis, setSynopsis] = useState<string | null>(null);
    const [suggestedTitle, setSuggestedTitle] = useState<string | null>(null);
    const [technicalDescription, setTechnicalDescription] = useState<TechnicalDescription | null>(null);
    const [taxonomyClassification, setTaxonomyClassification] = useState<TaxonomyClassification | null>(null);

    const [chatSession, setChatSession] = useState<Chat | null>(null);
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const resetAnalysisState = () => {
        setAnalysis(null);
        setEvents([]);
        setKeyPeople([]);
        setError(null);
        setChatSession(null);
        setChatHistory([]);
        setSynopsis(null);
        setSuggestedTitle(null);
        setTechnicalDescription(null);
        setTaxonomyClassification(null);
    };

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
            resetAnalysisState();
        }
    };
    
    const handleAnalyzeClick = useCallback(async () => {
        if (!selectedFile) return;

        setIsLoading(true);
        resetAnalysisState();

        try {
            setLoadingMessage('Extracting frames from video...');
            const frames = await extractFramesFromVideo(selectedFile, 15);
            
            setLoadingMessage('Analyzing frames with AI...');
            const result = await analyzeVideoAndStartChat(frames);
            setAnalysis(result.analysis);
            setEvents(result.events);
            setKeyPeople(result.keyPeople);
            setChatSession(result.chat);
            setSynopsis(result.synopsis);
            setSuggestedTitle(result.suggestedTitle);
            setTechnicalDescription(result.technicalDescription);
            setTaxonomyClassification(result.taxonomyClassification);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during video processing.';
            if (errorMessage.includes('Requested entity was not found.')) {
                setError('Your API key may be invalid or missing permissions. Please select a valid key and try again.');
                onApiKeyError();
            } else {
                setError(`Failed to analyze video. ${errorMessage}`);
            }
        } finally {
            setIsLoading(false);
            setLoadingMessage('');
        }
    }, [selectedFile, onApiKeyError]);

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
        
        setChatHistory(prev => [...prev, { role: 'model', text: '' }]);

        try {
            const stream = await sendMessageToChatStream(chatSession, userMessage);
            let responseText = '';
            for await (const chunk of stream) {
                responseText += chunk.text;
                setChatHistory(prev => {
                    const newHistory = [...prev];
                    newHistory[newHistory.length - 1] = { role: 'model', text: responseText };
                    return newHistory;
                });
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
            const newHistory = [...chatHistory, { role: 'user', text: userMessage }];
            if (errorMessage.includes('Requested entity was not found.')) {
                onApiKeyError();
                newHistory.push({ role: 'model', text: `Sorry, there was an issue with your API key. Please select a new one.` });
            } else {
                newHistory.push({ role: 'model', text: `Sorry, I encountered an error: ${errorMessage}` });
            }
            setChatHistory(newHistory);
        } finally {
            setIsChatLoading(false);
        }
    };

    const handleExport = () => {
        if (!analysis) return;
        const exportData = {
            suggestedTitle,
            synopsis,
            technicalDescription,
            taxonomyClassification,
            analysis,
            events,
            keyPeople,
        };
        const jsonString = JSON.stringify(exportData, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `video-analysis-${selectedFile?.name.split('.').slice(0, -1).join('.') || 'export'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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
                     <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg max-h-[calc(100vh-10rem)] overflow-y-auto">
                        {isLoading && <Loader message={loadingMessage} />}
                        {error && <p className="text-red-600">Error: {error}</p>}
                        
                        {suggestedTitle && !isLoading && (
                            <div className="mb-6 pb-4 border-b border-gray-200">
                                <h3 className="text-2xl font-bold text-gray-900">{suggestedTitle}</h3>
                                {synopsis && <p className="mt-2 text-gray-600">{synopsis}</p>}
                            </div>
                        )}

                        {taxonomyClassification && !isLoading && (
                            <div className="mb-6 p-4 rounded-lg bg-gray-100 border border-gray-200">
                                <h4 className="text-base font-semibold text-gray-800 mb-2">Taxonomy classification</h4>
                                <p className="font-mono text-xs bg-white p-2 rounded">
                                    {taxonomyClassification.path.split('>').map((part, i) => (
                                        <span key={i}>
                                            {i > 0 && <span className="text-gray-400 mx-1">&gt;</span>}
                                            {part.trim()}
                                        </span>
                                    ))}
                                </p>
                                <p className="mt-2 text-sm text-gray-700">{taxonomyClassification.reasoning}</p>
                            </div>
                        )}

                        {technicalDescription && !isLoading && (
                             <div className="mb-6">
                                <h4 className="text-base font-semibold text-gray-800 mb-2">Technical details</h4>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm p-4 rounded-lg bg-gray-100 border border-gray-200">
                                    <div className="font-semibold text-gray-600">Duration:</div> <div className="text-gray-800">{technicalDescription.duration}</div>
                                    <div className="font-semibold text-gray-600">Estimated Shots:</div> <div className="text-gray-800">{technicalDescription.estimatedShotCount}</div>
                                    <div className="font-semibold text-gray-600">Estimated Year:</div> <div className="text-gray-800">{technicalDescription.estimatedYear}</div>
                                    <div className="font-semibold text-gray-600">Estimated Origin:</div> <div className="text-gray-800">{technicalDescription.estimatedOrigin}</div>
                                    <div className="font-semibold text-gray-600">Aesthetic:</div> <div className="text-gray-800">{technicalDescription.formatAesthetic}</div>
                                </div>
                            </div>
                        )}

                        {analysis && <AnalysisDisplay text={analysis} />}

                        {events.length > 0 && !isLoading && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 border-t border-gray-200 pt-4 mb-2">Key moments</h4>
                                <ul className="space-y-2">
                                    {events.map((event, index) => (
                                        <li key={`event-${index}`}>
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

                        {keyPeople.length > 0 && !isLoading && (
                            <div className="mt-6">
                                <h4 className="text-lg font-semibold text-gray-800 border-t border-gray-200 pt-4 mb-2">Key people identified</h4>
                                <ul className="space-y-2">
                                    {keyPeople.map((person, index) => (
                                        <li key={`person-${index}`}>
                                            <button 
                                                onClick={() => handleTimestampClick(person.timestamp)}
                                                className="text-left w-full p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                                            >
                                                <span className="font-semibold text-black">{person.timeString}</span>
                                                <span className="ml-2 text-gray-700 font-medium">{person.name}:</span>
                                                <span className="ml-1 text-gray-600">{person.description}</span>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        
                        {!isLoading && !analysis && !error && !suggestedTitle && (
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
