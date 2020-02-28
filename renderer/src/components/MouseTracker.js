import React, { useState, useEffect } from "react";

const MouseTracker = () => {
    const [positions, setPositions] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const updateMouse = event => {
            console.log("inner");
            setPositions({ x: event.clientX, y: event.clientY });
        };

        console.log("add listener");
        document.addEventListener("click", updateMouse);

        return () => {
            console.log("remove listener");
            document.removeEventListener("click", updateMouse);
        };
    });
    return (
        <p>
            x: {positions.x}, y: {positions.y}
        </p>
    );
};

export default MouseTracker;
