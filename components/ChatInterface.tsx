import React from 'react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

interface ChatInterfaceProps {
  history: ChatMessage[];
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const formatChatMessage = (text: string) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // Italics
    .replace(/\n/g, '<br />'); // Newlines
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ history, inputValue, onInputChange, onSendMessage, isLoading }) => {
  return (
    <div className="mt-6 border-t border-gray-200 pt-4">
      <h4 className="text-lg font-semibold text-gray-800 mb-4">Chat about this</h4>
      
      {/* Chat History */}
      <div className="space-y-4 mb-4">
        {history.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-200 text-gray-800'}`}>
              <p className="text-sm" dangerouslySetInnerHTML={{ __html: formatChatMessage(msg.text) }} />
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                 <div className="max-w-md p-3 rounded-lg bg-gray-200 text-gray-800">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                 </div>
            </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={onSendMessage} className="flex space-x-2">
        <input
          type="text"
          value={inputValue}
          onChange={onInputChange}
          placeholder="Ask a follow-up question..."
          disabled={isLoading}
          className="flex-grow border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
        <button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          className="bg-black text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;