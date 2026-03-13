import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const CursorFollower = () => {
    const [isHovering, setIsHovering] = useState(false);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the motion
    const springConfig = { damping: 25, stiffness: 200 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const moveMouse = (e) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        const handleHoverStart = (e) => {
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('a')) {
                setIsHovering(true);
            }
        };

        const handleHoverEnd = () => {
            setIsHovering(false);
        };

        window.addEventListener("mousemove", moveMouse);
        window.addEventListener("mouseover", handleHoverStart);
        window.addEventListener("mouseout", handleHoverEnd);

        return () => {
            window.removeEventListener("mousemove", moveMouse);
            window.removeEventListener("mouseover", handleHoverStart);
            window.removeEventListener("mouseout", handleHoverEnd);
        };
    }, [mouseX, mouseY]);

    return (
        <>
            <motion.div
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: isHovering ? 60 : 32,
                    height: isHovering ? 60 : 32,
                    backgroundColor: isHovering ? "rgba(99, 102, 241, 0.15)" : "transparent",
                    border: `1px solid ${isHovering ? "rgba(99, 102, 241, 0.5)" : "rgba(255, 255, 255, 0.3)"}`,
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 9999,
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    backdropFilter: isHovering ? "blur(4px)" : "none",
                }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
            />
            <motion.div
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: 8,
                    height: 8,
                    backgroundColor: isHovering ? "var(--accent)" : "var(--primary)",
                    borderRadius: "50%",
                    pointerEvents: "none",
                    zIndex: 10000,
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    boxShadow: isHovering ? "0 0 20px var(--accent)" : "0 0 10px var(--primary)",
                }}
            />
        </>
    );
};

export default CursorFollower;
