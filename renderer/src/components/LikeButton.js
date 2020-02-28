import React, { useState, useEffect } from "react";

const LikeButton = () => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        document.title = `点击了${count}次`;
    });
    return (
        <button
            onClick={() => {
                setCount(count + 1);
            }}
        >
            {count}👍
        </button>
    );
};

export default LikeButton;
