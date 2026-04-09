import { FaStar } from "react-icons/fa";

function RatingStars({ value }) {
    return (
        <div className="flex gap-1">
            {[...Array(value)].map((_, i) => (
                <FaStar key={i} className="text-primary" />
            ))}
            {[...Array(5 - value)].map((_, i) => (
                <FaStar key={i} className="text-gray-500" />
            ))}
        </div>
    )
}

export default RatingStars