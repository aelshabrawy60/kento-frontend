import axios from 'axios';
import React from 'react'

function SavePost({ postId }) {
    const [saved, setSaved] = React.useState(false);
    const handleSave = async () => {
        setSaved(!saved);

        try {
            if (saved) {
                await axios.delete(`${import.meta.env.VITE_API_URL}/clients/posts`,
                    {
                        postId: postId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/clients/posts`,
                    {
                        postId: postId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`
                        }
                    }
                )
            }
        } catch {
            setSaved(!saved)
        }
    }

    return (
        <div>
            <button onClick={handleSave}>
                {saved ? 'Unsave' : 'Save'}
            </button>
        </div>
    )
}

export default SavePost