import { useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import api from '../api/axios';
import { useAuth } from './useAuth';

const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const SOCKET_URL = VITE_API_URL.replace('/api', '').replace(/"/g, '').trim();

export const useChat = () => {
    const { user } = useAuth();
    const [socket, setSocket] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [activeConversation, setActiveConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const newSocket = io(SOCKET_URL);
        setSocket(newSocket);

        return () => newSocket.close();
    }, [user]);

    const fetchConversations = useCallback(async () => {
        try {
            const res = await api.get('/chats/conversations');
            setConversations(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching conversations", error);
            setLoading(false);
        }
    }, []);

    const fetchMessages = useCallback(async (conversationId) => {
        try {
            const res = await api.get(`/chats/conversations/${conversationId}/messages`);
            setMessages(res.data.data);
        } catch (error) {
            console.error("Error fetching messages", error);
        }
    }, []);

    useEffect(() => {
        if (user) {
            fetchConversations();
        }
    }, [user, fetchConversations]);

    useEffect(() => {
        if (socket && activeConversation) {
            socket.emit('join_room', activeConversation.id);
            fetchMessages(activeConversation.id);

            const handleReceiveMessage = (message) => {
                if (message.conversationId === activeConversation.id) {
                    setMessages(prev => [...prev, message]);
                }
                fetchConversations(); // Update latest message in list
            };

            socket.on('receive_message', handleReceiveMessage);

            return () => {
                socket.off('receive_message', handleReceiveMessage);
            };
        }
    }, [socket, activeConversation, fetchMessages, fetchConversations]);

    const sendMessage = useCallback(async (content) => {
        if (!socket || !activeConversation || !user || !content.trim()) return;

        socket.emit('send_message', {
            conversationId: activeConversation.id,
            senderId: user.id,
            content
        });
    }, [socket, activeConversation, user]);

    const startConversation = useCallback(async (targetUserId) => {
        try {
            const res = await api.post('/chats/conversations', { targetUserId });
            const conversation = res.data.data;
            setActiveConversation(conversation);
            await fetchConversations();
            return conversation;
        } catch (error) {
            console.error("Error starting conversation", error);
        }
    }, [fetchConversations]);

    return {
        conversations,
        activeConversation,
        setActiveConversation,
        messages,
        sendMessage,
        startConversation,
        loading
    };
};
