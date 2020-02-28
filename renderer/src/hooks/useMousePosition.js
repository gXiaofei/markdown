import React, {useState, useEffect} from 'react'

// 自定义hooks
const useMousePosition = () => {
    const [positions, setPositions] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const updateMouse = event => {
            setPositions({ x: event.clientX, y: event.clientY });
        };
        document.addEventListener("mousemove", updateMouse);
        return () => {
            document.removeEventListener("mousemove", updateMouse);
        };
    });
    return positions
}


export default useMousePosition