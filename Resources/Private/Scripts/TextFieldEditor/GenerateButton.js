import React, { useState, useCallback } from "react";
import { Sparkles, Check } from "lucide-react";

const GenerateButton = ({ onClick }) => {
    const [state, setState] = useState("idle");
    const [isHovered, setIsHovered] = useState(false);

    const startGenerating = useCallback(() => {
        if (state !== "idle") return;
        setState("generating");
    }, [state]);

    const complete = useCallback(() => {
        setState("transitioning");
        setTimeout(() => {
            setState("complete");
            setTimeout(() => {
                setState("idle");
            }, 2000);
        }, 150);
    }, []);

    const reset = useCallback(() => {
        setState("idle");
    }, []);

    const handleClick = useCallback(() => {
        if (state !== "idle") return;
        startGenerating();
        onClick?.(
            () => complete(),
            () => reset()
        );
    }, [state, onClick, startGenerating, complete, reset]);

    const isGenerating = state === "generating" || state === "transitioning";

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            disabled={state !== "idle"}
            style={{
                ...styles.button,
                backgroundColor:
                    state === 'generating' ? '#ff8700' :
                        state === 'complete' ? '#00a338' :
                            isHovered ? '#00adee' :
                                '#3f3f3f',
            }}
        >
            {/* Content */}
            <div style={styles.contentWrapper}>
                <div style={styles.iconWrapper}>
                    <Sparkles
                        style={{
                            ...styles.icon,
                            animation: isGenerating ? "sparkle 1s ease-in-out infinite" : "none",
                            opacity: state === "complete" ? 0 : 1,
                            transition: "opacity 0.2s ease",
                        }}
                    />
                    <Check
                        style={{
                            ...styles.icon,
                            animation: state === "complete" ? "scaleIn 0.3s ease forwards" : "none",
                            opacity: state === "complete" ? 1 : 0,
                            transition: "opacity 0.2s ease",
                        }}
                    />
                </div>

                <span
                    style={{
                        ...styles.text,
                        opacity: state === "transitioning" ? 0 : 1,
                    }}
                >
                    {state === "complete" ? "Done" : isGenerating ? "Generating..." : "Generate"}
                </span>
            </div>
        </button>
    );
};

const styles = {
    button: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        border: 'none',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        cursor: 'pointer',
        outline: 'none',
        minWidth: '120px',
        height: '36px',
        transition: 'background-color 0s',
        '&:disabled': {
            cursor: 'default',
        },
    },
    contentWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        zIndex: 1,
    },
    iconWrapper: {
        width: '16px',
        height: '16px',
        position: 'relative',
    },
    icon: {
        width: '16px',
        height: '16px',
        color: 'white',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    text: {
        transition: 'opacity 0.2s ease',
        userSelect: 'none',
    },
};

// Add keyframes
const keyframes = `
  @keyframes sparkle {
    0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); }
    50% { transform: translate(-50%, -50%) scale(1.2) rotate(180deg); }
    100% { transform: translate(-50%, -50%) scale(1) rotate(360deg); }
  }
  
  @keyframes scaleIn {
    0% { transform: translate(-50%, -50%) scale(0); }
    50% { transform: translate(-50%, -50%) scale(1.2); }
    100% { transform: translate(-50%, -50%) scale(1); }
  }
`;

// Inject keyframes
const styleSheet = document.createElement("style");
styleSheet.textContent = keyframes;
document.head.appendChild(styleSheet);

export default GenerateButton;
