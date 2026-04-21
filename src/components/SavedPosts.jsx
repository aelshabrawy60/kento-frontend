import React from 'react'
import SavedPostCard from './SavedPostCard'
import axios from 'axios'

function SavedPosts() {
    const [savedPosts, setSavedPosts] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    const fetchSavedPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/clients/saves`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            setSavedPosts(response.data.savedPosts);
        } catch (error) {
            console.error('Error fetching saved posts:', error);
        } finally {
            setLoading(false);
        }
    }

    React.useEffect(() => {
        fetchSavedPosts();
    }, []);

    return (
        <div>
            <div className='flex justify-between mb-4'>
                <h2 className='text-2xl font-bold'>Saved</h2>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'>
                {savedPosts.map((item, index) => (
                    <SavedPostCard key={index} data={item} />
                ))}
            </div>
        </div>
    )
}

export default SavedPosts