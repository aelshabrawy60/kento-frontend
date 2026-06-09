import React from 'react'

function NotificationLoading() {
    return (
        <div className="px-4 py-3 animate-pulse flex items-start gap-3 bg-gray-50/50 border-b border-gray-50 last:border-0">
            <div className="mt-1 flex-shrink-0">
                <div className="h-2 w-2 bg-slate-300 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-2">
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-4/5"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4 mt-1"></div>
            </div>
        </div>
    )
}

export default NotificationLoading
