import React, { useEffect, useState } from "react";
import "./OnePlusOneOffer.css";

const OnePlusOneOffer = ({ offerproduct }) => {
    const [offers, setoffers] = useState(null);
    useEffect(() => {
        const fetchOffers = async () => {
            try {
                const response = await fetch("/offer.json");
                const data = await response.json();
                setoffers(data.onePlusOneOffer)
            } catch (error) {
                console.error("Error fetching offers:", error);
            }
        };

        fetchOffers();
    }, []);

    const start = new Date();
    const end = new Date(offers?.end_time || null);


    const diffInMs = end - start;
    const diffInSeconds = diffInMs / 1000;


    const formatTime = (seconds) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${days}d ${hrs}hr ${mins}m `;
    };
    return (
        <>
            {diffInSeconds > 5 ? (
                <div className="offer-page">
                    <div className="offer-container">
                        <div className="offer-top-label">{offerproduct}</div>
                        <div className="offer-main-box">
                            <div className="offer-line1">
                                BUY <span className="highlight">1</span> GET <span className="highlight">1</span>
                            </div>
                            <div className="offer-line2">FREE</div>
                        </div>
                        <div className="offer-date-box">{formatTime(diffInSeconds)}</div>
                    </div>
                    <h2 style={{margin:'20px'}}>Unlock this offer with a full online payment </h2>
                </div>
            ) : (<></>)
            }
        </>
    );
};

export default OnePlusOneOffer;
