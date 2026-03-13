import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated, config } from '@react-spring/web';

// Premium Glass Card with React Spring Hover
export const GlassCard = ({ children, className = "", ...props }) => {
    const [hovered, setHovered] = useState(false);
    const styles = useSpring({
        transform: hovered ? 'scale(1.02) translateY(-5px)' : 'scale(1) translateY(0px)',
        border: hovered ? '1px solid var(--primary)' : '1px solid var(--glass-border)',
        boxShadow: hovered ? '0 20px 40px rgba(0,0,0,0.4), 0 0 20px var(--primary-glow)' : '0 10px 20px rgba(0,0,0,0.2), 0 0 0px transparent',
        config: config.gentle
    });

    return (
        <animated.div
            style={{
                ...styles,
                padding: '32px',
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--glass)',
                backdropFilter: 'blur(12px)',
                borderRadius: '24px',
                cursor: 'none'
            }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`glass ${className}`}
            {...props}
        >
            {children}
        </animated.div>
    );
};

// Glowing Action Button with React Spring
export const GlowingButton = ({ children, className = "", ...props }) => {
    const [hovered, setHovered] = useState(false);
    const springs = useSpring({
        transform: hovered ? 'scale(1.05)' : 'scale(1)',
        filter: hovered ? 'brightness(1.2)' : 'brightness(1)',
        boxShadow: hovered ? '0 0 30px var(--primary-glow)' : '0 10px 15px -3px rgba(99, 102, 241, 0.3)',
        config: { tension: 300, friction: 10 }
    });

    return (
        <animated.button
            style={springs}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`btn-primary ${className}`}
            {...props}
        >
            {children}
        </animated.button>
    );
};

// Animated Badge
export const Badge = ({ children, color = "var(--primary)" }) => (
    <span style={{
        padding: '4px 12px',
        borderRadius: '100px',
        fontSize: '12px',
        fontWeight: '700',
        background: `${color}20`,
        color: color,
        border: `1px solid ${color}40`,
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
    }}>
        {children}
    </span>
);

// Modern Modal
export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={onClose}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
            />
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="glass"
                style={{ width: '100%', maxWidth: '500px', padding: '32px', position: 'relative', zIndex: 1001 }}
            >
                <h2 style={{ marginBottom: '16px' }}>{title}</h2>
                {children}
                <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', color: 'white', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px' }}>&times;</button>
            </motion.div>
        </div>
    );
};
