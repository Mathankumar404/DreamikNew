import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

const LOG_API_URL = "https://dreamik-intern.onrender.com/api/log";
const DEBOUNCE_TIME = 3000; // 3 seconds

const PageLogger = () => {
    const location = useLocation();
    const lastLogRef = useRef(null);

    useEffect(() => {
        const logEntry = {
            page: location.pathname,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent, // Tracks user device info
        };

        let logs = JSON.parse(sessionStorage.getItem("userLogs")) || [];

        // ✅ Prevent duplicate logs within DEBOUNCE_TIME (2 seconds)
        if (lastLogRef.current && Math.abs(new Date(lastLogRef.current.timestamp) - new Date(logEntry.timestamp)) < DEBOUNCE_TIME) {
            return;
        }

        logs.push(logEntry);
        sessionStorage.setItem("userLogs", JSON.stringify(logs));
        lastLogRef.current = logEntry; // Update the last logged entry
        // ✅ Send logs in batches (if multiple logs exist)
        // sendLogs(logs);
    }, [location.pathname]); // Logs only when the page changes

    return null; // This component only logs, doesn't render anything
};

// const sendLogs = async (logs) => {
//     try {
//         const response = await fetch(LOG_API_URL, {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(logs),
//         });

//         if (!response.ok) throw new Error(`Server error: ${response.status}`);

//         console.log("✅ Logs sent successfully:", await response.json());

//         // ✅ Clear sessionStorage after successful upload
//         sessionStorage.removeItem("userLogs");
//     } catch (err) {
//         console.error("❌ Log upload failed:", err);
//     }
// };

export default PageLogger;