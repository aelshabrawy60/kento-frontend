import axios from 'axios';
import React from 'react'
import { FaRegHeart } from "react-icons/fa";
import { FaHeart } from "react-icons/fa";

function SavePost({ postId, defaultSaved = false, className = '' }) {
    const [saved, setSaved] = React.useState(defaultSaved);
    const [animState, setAnimState] = React.useState({ show: false, scale: false, saving: false });
    const timeoutRef = React.useRef({ scaleIn: null, scaleOut: null, hide: null });

    const handleSave = async () => {
        const nextSaved = !saved;
        setSaved(nextSaved);

        // Animation logic
        if (timeoutRef.current.scaleIn) clearTimeout(timeoutRef.current.scaleIn);
        if (timeoutRef.current.scaleOut) clearTimeout(timeoutRef.current.scaleOut);
        if (timeoutRef.current.hide) clearTimeout(timeoutRef.current.hide);

        setAnimState({ show: true, scale: false, saving: nextSaved });

        timeoutRef.current.scaleIn = setTimeout(() => {
            setAnimState(prev => ({ ...prev, scale: true }));
        }, 10);

        timeoutRef.current.scaleOut = setTimeout(() => {
            setAnimState(prev => ({ ...prev, scale: false }));
        }, 600);

        timeoutRef.current.hide = setTimeout(() => {
            setAnimState(prev => ({ ...prev, show: false }));
        }, 900);

        try {
            if (saved) {
                await axios.delete(`${import.meta.env.VITE_API_URL}/clients/saves`,
                    {
                        data: {
                            postId: postId,
                        },
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }
                )
            } else {
                await axios.post(`${import.meta.env.VITE_API_URL}/clients/saves`,
                    {
                        postId: postId,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    }
                )
            }
        } catch {
            setSaved(!saved)
        }
    }

    return (
        <>
            <div className={`absolute top-2 right-2 transition-opacity duration-300 ${saved ? 'block opacity-100' : className}`}>
                <button className="save-post-btn" onClick={handleSave}>
                    {saved ? <FaHeart className='text-red-500' size={24} /> : <FaRegHeart className='text-white' size={24} />}
                </button>
            </div>
            {animState.show && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden rounded-lg">
                    <div 
                        className={`transition-all duration-300 transform ${
                            animState.scale ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
                        }`}
                    >
                        {animState.saving ? (
                            <FaHeart className="text-red-500 drop-shadow-2xl" size={100} />
                        ) : (
                            <div className="relative flex items-center justify-center">
                                <FaHeart className="text-gray-900/40 absolute drop-shadow-2xl" size={100} />
                                <FaRegHeart className="text-white drop-shadow-2xl relative z-10" size={100} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default SavePost