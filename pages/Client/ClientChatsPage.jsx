import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Chat, useCreateChatClient, Channel, ChannelHeader, MessageList, MessageInput, Thread, Window, ChannelList, useChatContext } from 'stream-chat-react';

const apiKey = import.meta.env.VITE_STREAM_API_KEY;
const userId = localStorage.getItem('userId');
const token = localStorage.getItem('streamChatToken');
const userName = localStorage.getItem('userName');

const user = {
    id: userId,
    name: userName,
    image: `https://getstream.io/random_png/?name=${userName}`,
};

const sort = { last_message_at: -1 };
const filters = {
    type: 'messaging',
    members: { $in: [userId] },
};
const options = {
    limit: 10,
};

const ChatLayout = ({ filters, sort, options, id }) => {
    const { client, channel, setActiveChannel } = useChatContext();
    const navigate = useNavigate();

    useEffect(() => {
        const createChannelIfNotExists = async () => {
            if (!client || !id) return;

            try {
                // By providing just the members array and omitting the explicit ID, 
                // Stream natively handles creating or returning the deterministic 1-on-1 channel.
                const newChannel = client.channel('messaging', {
                    members: [user.id, id],
                });
                await newChannel.watch();

                // Set the channel as active in the chat context
                setActiveChannel(newChannel);
            } catch (error) {
                console.error("Error creating or joining channel:", error);
            }
        };

        createChannelIfNotExists();
    }, [client, id, setActiveChannel]);
    // We consider it active if a channel is selected OR if there is an ID in the URL.
    const isChannelActive = !!channel || !!id;

    const handleBack = () => {
        if (channel) {
            setActiveChannel(undefined);
        }
        if (id) {
            // Remove the ID from the URL so we don't default to 'active' on refresh
            navigate('/chats', { replace: true });
        }
    };

    return (
        <div className="flex w-full h-[calc(100vh-10px)] md:h-[calc(100vh-128px)] overflow-hidden">
            <div className={`h-full border-gray-200 md:w-1/3 md:block ${isChannelActive ? 'hidden' : 'w-full block md:border-r'}`}>
                <ChannelList filters={filters} sort={sort} options={options} customActiveChannel={channel} setActiveChannelOnMount={false} />
            </div>
            <div className={`h-full md:w-2/3 md:flex flex-col ${isChannelActive ? 'w-full flex' : 'hidden'}`}>
                <div className="flex-1 overflow-hidden relative z-50">
                    <Channel>
                        <Window>
                            <div className="relative flex items-center bg-white border-b border-gray-200 [&_.str-chat__header-messaging]:border-b-0 [&_.str-chat__header-messaging]:pl-12! md:[&_.str-chat__header-messaging]:pl-4!">
                                {/* Mobile back button inside header */}
                                {isChannelActive && (
                                    <button
                                        onClick={handleBack}
                                        className="md:hidden absolute right-2 z-10 text-primary hover:bg-gray-100 p-2 text-2xl rounded-md transition-colors"
                                        title="Back to Channels"
                                    >
                                        &larr;
                                    </button>
                                )}
                                <div className="flex-1 w-full">
                                    <ChannelHeader />
                                </div>
                            </div>
                            <MessageList />
                            <MessageInput />
                        </Window>
                        <Thread />
                    </Channel>
                </div>
            </div>
        </div>
    );
};

function ClientChatsPage() {
    const { id } = useParams();
    const client = useCreateChatClient({
        apiKey,
        tokenOrProvider: token,
        userData: user,
    });

    if (!client) return <div className="flex items-center justify-center h-screen">Setting up client & connection...</div>;

    return (
        <div className='flex w-full'>
            <Chat client={client} theme='str-chat__theme-custom'>
                <ChatLayout filters={filters} sort={sort} options={options} id={id} />
            </Chat>
        </div>
    );
}

export default ClientChatsPage