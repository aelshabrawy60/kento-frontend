import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { format } from 'date-fns';

const ChatList = ({ conversations, activeConversation, onSelectConversation }) => {
    const { user } = useAuth();

    if (!conversations || conversations.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full p-4 text-gray-500">
                <p>No conversations yet.</p>
            </div>
        );
    }

    return (
        <div className="overflow-y-auto h-full flex flex-col scrollbar-thin">
            {conversations.map(conv => {
                // Find the other participant
                const otherUser = conv.participants.find(p => p.id !== user.id) || conv.participants[0];
                const isActive = activeConversation?.id === conv.id;
                const latestMessage = conv.messages?.[0];

                return (
                    <button
                        key={conv.id}
                        onClick={() => onSelectConversation(conv)}
                        className={`flex items-center gap-3 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors w-full text-left ${isActive ? 'bg-primary/5 border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'}`}
                    >
                        <img 
                            src={otherUser.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(otherUser.name || 'U')}&background=random`} 
                            alt={otherUser.name} 
                            className="w-12 h-12 rounded-full object-cover shrink-0 border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1">
                                <h3 className="font-semibold text-gray-900 truncate">{otherUser.name || 'Unknown User'}</h3>
                                {latestMessage && (
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2 font-medium">
                                        {format(new Date(latestMessage.createdAt), 'h:mm a')}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-500 truncate">
                                {latestMessage ? (
                                    latestMessage.senderId === user.id ? `You: ${latestMessage.content}` : latestMessage.content
                                ) : (
                                    <span className="italic">No messages yet</span>
                                )}
                            </p>
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default ChatList;
