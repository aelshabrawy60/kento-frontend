import React, { useEffect, useState } from 'react';
import { useChat } from '../../hooks/useChat';
import ChatList from '../../components/Chat/ChatList';
import ChatWindow from '../../components/Chat/ChatWindow';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ChatsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { 
        conversations, 
        activeConversation, 
        setActiveConversation, 
        messages, 
        sendMessage, 
        startConversation,
        loading 
    } = useChat();

    const [isMobileListVisible, setIsMobileListVisible] = useState(true);

    // Handle initial route ID mapping to conversation
    useEffect(() => {
        if (loading || !id) return;

        // Prevent infinite loop if we are already viewing this chat
        if (activeConversation?.participants?.some(p => p.id === id)) {
            setIsMobileListVisible(false);
            return;
        }

        // Find existing conversation with this user
        const existingConv = conversations.find(c => c.participants.some(p => p.id === id));
        if (existingConv) {
            setActiveConversation(existingConv);
            setIsMobileListVisible(false);
        } else {
            // If ID is provided but conversation doesn't exist, try to start it
            startConversation(id).then(conv => {
                if (conv) {
                    setIsMobileListVisible(false);
                }
            });
        }
    }, [id, loading, conversations, activeConversation, setActiveConversation, startConversation]);

    // Handle browser back button / programmatic navigation out of chat
    const handleBack = () => {
        setActiveConversation(null);
        setIsMobileListVisible(true);
        // Determine base path based on current URL
        const basePath = window.location.pathname.includes('/vendor') ? '/vendor/chats' : '/chats';
        navigate(basePath, { replace: true });
    };

    const handleSelectConversation = (conv) => {
        setActiveConversation(conv);
        setIsMobileListVisible(false);
        // We could update the URL here to include the other user's ID if we wanted deep linking, 
        // but keeping it on the base route is simpler for now.
    };

    if (loading) {
        return (
            <div className="flex h-[calc(100vh-10px)] md:h-[calc(100vh-128px)] items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="flex w-full h-full bg-white md:rounded-2xl shadow-sm border-t md:border border-gray-200 overflow-hidden">
            {/* Sidebar (List) */}
            <div className={`h-full border-r border-gray-100 md:w-[350px] lg:w-[400px] flex-shrink-0 ${isMobileListVisible ? 'w-full block' : 'hidden md:block'}`}>
                <div className="p-4 md:p-5 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center gap-3">
                    <button 
                        onClick={() => navigate(window.location.pathname.includes('/vendor') ? '/vendor' : '/')} 
                        className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                        title="Back to Home"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Messages</h1>
                </div>
                <ChatList 
                    conversations={conversations} 
                    activeConversation={activeConversation}
                    onSelectConversation={handleSelectConversation}
                />
            </div>

            {/* Main Window */}
            <div className={`h-full flex-1 min-w-0 ${isMobileListVisible ? 'hidden md:block' : 'w-full block'}`}>
                <ChatWindow 
                    conversation={activeConversation} 
                    messages={messages} 
                    onSendMessage={sendMessage}
                    onBack={handleBack}
                />
            </div>
        </div>
    );
};

export default ChatsPage;
