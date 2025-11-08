import React, { useState } from 'react';
import Header from './components/Header';
import ImageAnalyzer from './components/ImageAnalyzer';
import VideoAnalyzer from './components/VideoAnalyzer';
import TabButton from './components/TabButton';

type Tab = 'image' | 'video';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('image');

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center bg-gray-50 border border-gray-200/80 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Workshop: Deconstructing machine vision</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Upload an image or video to see how an AI model classifies and interprets it. This exercise reveals both the capabilities and the blind spots of machine vision, helping us understand the biases embedded in these powerful systems.
            </p>
          </div>

          <div className="flex justify-center space-x-8 mb-8 border-b border-gray-200">
            <TabButton 
              label="Image analysis" 
              isActive={activeTab === 'image'} 
              onClick={() => setActiveTab('image')} 
            />
            <TabButton 
              label="Video analysis" 
              isActive={activeTab === 'video'} 
              onClick={() => setActiveTab('video')} 
            />
          </div>

          <div>
            {activeTab === 'image' && <ImageAnalyzer />}
            {activeTab === 'video' && <VideoAnalyzer />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;