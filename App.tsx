
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ImageAnalyzer from './components/ImageAnalyzer';
import VideoAnalyzer from './components/VideoAnalyzer';
import TaxonomyGraph from './components/TaxonomyGraph';
import TabButton from './components/TabButton';
import Auth from './components/Auth';
import Settings from './components/Settings';
import Login from './components/Login';

type Tab = 'taxonomy' | 'image' | 'video' | 'settings';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<Tab>('taxonomy');
  const [isKeySelected, setIsKeySelected] = useState<boolean>(false);

  const handleLoginSuccess = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const handleKeySelectionSuccess = useCallback(() => {
    setIsKeySelected(true);
  }, []);
  
  const handleApiKeyError = useCallback(() => {
    console.warn("Resetting API key selection due to an error.");
    setIsKeySelected(false);
  }, []);

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  if (!isKeySelected) {
    return <Auth onLoginSuccess={handleKeySelectionSuccess} />;
  }

  const getDescription = () => {
    switch(activeTab) {
      case 'taxonomy':
        return 'Explore the Milliere media taxonomy to understand the framework for classifying hand-made and machine-made media.';
      case 'settings':
        return 'Manage your API key for accessing Google\'s generative AI models.';
      case 'image':
      case 'video':
      default:
        return 'Upload an image or video to see how an AI model classifies and interprets it. This exercise reveals both the capabilities and the blind spots of machine vision, helping us understand the biases embedded in these powerful systems.';
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12 text-center bg-gray-50 border border-gray-200/80 p-6 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Workshop: Deconstructing machine vision</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              {getDescription()}
            </p>
          </div>

          <div className="flex justify-center space-x-8 mb-8 border-b border-gray-200">
            <TabButton
              label="Taxonomy explorer"
              isActive={activeTab === 'taxonomy'}
              onClick={() => setActiveTab('taxonomy')}
            />
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
            <TabButton
              label="API Key"
              isActive={activeTab === 'settings'}
              onClick={() => setActiveTab('settings')}
            />
          </div>

          <div>
            <div className={activeTab === 'taxonomy' ? '' : 'hidden'}>
              <TaxonomyGraph />
            </div>
            <div className={activeTab === 'image' ? '' : 'hidden'}>
              <ImageAnalyzer onApiKeyError={handleApiKeyError} />
            </div>
            <div className={activeTab === 'video' ? '' : 'hidden'}>
              <VideoAnalyzer onApiKeyError={handleApiKeyError} />
            </div>
            <div className={activeTab === 'settings' ? '' : 'hidden'}>
              <Settings />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
