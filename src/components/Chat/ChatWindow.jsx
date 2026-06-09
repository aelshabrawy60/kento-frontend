import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Send, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';

const ChatWindow = ({ conversation, messages, onSendMessage, onBack }) => {
    const { user } = useAuth();
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!conversation) {
        return (
            <div className="hidden md:flex flex-col items-center justify-center h-full bg-gray-50/50 text-gray-400">
                <div className="p-5 bg-white rounded-full mb-4 shadow-sm border border-gray-100">
                    <svg className="w-10 h-10 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700">Your Messages</h3>
                <p className="text-sm mt-1 text-gray-500">Choose a chat from the list to start messaging.</p>
            </div>
        );
    }

    const otherUser = conversation.participants.find(p => p.id !== user.id) || conversation.participants[0];

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage("");
        }
    };

    return (
        <div className="flex flex-col h-full bg-white relative w-full">
            {/* Header */}
            <div className="flex items-center px-4 py-3.5 border-b border-gray-100 bg-white shadow-sm z-10 sticky top-0">
                <button 
                    onClick={onBack}
                    className="md:hidden mr-3 p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <img 
                    src={otherUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name || 'U')}&background=random`} 
                    alt={otherUser.name} 
                    className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100"
                />
                <div className="ml-3">
                    <h2 className="font-semibold text-gray-900">{otherUser.name || 'Unknown User'}</h2>
                    <p className="text-xs font-medium text-gray-500 capitalize">{otherUser.role.toLowerCase()}</p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8fafc] scrollbar-thin">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <p className="text-sm bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">No messages yet. Say hi!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.senderId === user.id;
                        const showAvatar = !isMe && (index === messages.length - 1 || messages[index + 1]?.senderId === user.id);
                        
                        return (
                            <div key={msg.id || index} className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-4`}>
                                {!isMe && (
                                    <div className="w-8 mr-2 flex-shrink-0 flex items-end">
                                        {showAvatar && (
                                            <img 
                                                src={msg.sender?.profilePicture || otherUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(msg.sender?.name || 'U')}&background=random`} 
                                                alt="avatar" 
                                                className="w-8 h-8 rounded-full object-cover shadow-sm"
                                            />
                                        )}
                                    </div>
                                )}
                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                    <div 
                                        className={`px-4 py-2.5 rounded-2xl shadow-sm relative group ${
                                            isMe 
                                                ? 'bg-primary text-white rounded-br-sm' 
                                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-sm'
                                        }`}
                                    >
                                        <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">{msg.content}</p>
                                    </div>
                                    <span className="text-[10px] text-gray-400 mt-1 mx-1 font-medium">
                                        {format(new Date(msg.createdAt), 'h:mm a')}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-t border-gray-100">
                <form 
                    onSubmit={handleSubmit}
                    className="flex items-end gap-2 bg-gray-50/80 p-1.5 rounded-3xl border border-gray-200 focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 transition-all shadow-inner"
                >
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                        placeholder="Message..."
                        className="flex-1 max-h-32 min-h-[44px] bg-transparent border-none focus:ring-0 resize-none py-3 px-4 text-[15px] text-gray-700 outline-none placeholder:text-gray-400 scrollbar-thin"
                        rows={1}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim()}
                        className="p-3 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0 shadow-sm disabled:shadow-none mr-0.5 mb-0.5"
                    >
                        <Send size={18} className="translate-x-[-1px] translate-y-[1px]" />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatWindow;
