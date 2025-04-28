import React, { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./location.css";

const Location = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [locations, setLocations] = useState([]);
    const mapRef = useRef(null);

    // Initialize map only once when component mounts
    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map("map").setView([13.067439, 80.237617], 15);

            L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                maxZoom: 19,
                attribution: "© OpenStreetMap contributors",
            }).addTo(mapRef.current);

            L.marker([13.067439, 80.237617])
                .addTo(mapRef.current)
                .bindPopup(
                    "MURVEN Infotech Design Solutions LLP<br>715-A, 7th Floor, Spencer Plaza,<br>Suite No.548, Mount Road, Anna Salai,<br>Chennai - 600 002, Tamil Nadu, India."
                )
                .openPopup();
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Fetch locations from XML file
    const parseXML = async () => {
        const response = await fetch("/data.xml");
        const text = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "text/xml");
        const placemarks = xmlDoc.getElementsByTagName("Placemark");
        const extractedLocations = [];

        Array.from(placemarks).forEach((placemark) => {
            const name = placemark.getElementsByTagName("name")[0]?.textContent;
            const coordinates = placemark
                .getElementsByTagName("coordinates")[0]
                ?.textContent.trim();
            const searchTags =
                placemark.getElementsByTagName("SearchTags")[0]?.textContent ||
                "No additional details available";
            if (name && coordinates) {
                const coordsArray = coordinates.split(",");
                const lon = parseFloat(coordsArray[0]);
                const lat = parseFloat(coordsArray[1]);

                if (!isNaN(lat) && !isNaN(lon)) {
                    extractedLocations.push({ name, lat, lon, searchTags });

                    // Add a marker for each location
                    L.marker([lat, lon])
                        .addTo(mapRef.current)
                        .bindPopup(`<strong style="font-size:16px;">${name}</strong><br>${searchTags}`);

                }
            }
        });

        setLocations(extractedLocations);
    };

    useEffect(() => {
        parseXML();
    }, []);

    // Search locations
    const searchLocation = () => {
        if (!mapRef.current) return;

        // Clear previous markers
        mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
                mapRef.current.removeLayer(layer);
            }
        });

        const filteredLocations = locations.filter(
            (loc) =>
                loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                loc.searchTags.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (filteredLocations.length === 0) {
            alert("No results found!");
            return;
        }

        // Add markers for matched locations
        filteredLocations.forEach((loc) => {
            L.marker([loc.lat, loc.lon])
                .addTo(mapRef.current)
                .bindPopup(`<b>${loc.name}</b><br>${loc.searchTags}`)
                .openPopup();
        });

        // Center map on first matched location
        const firstLocation = filteredLocations[0];
        mapRef.current.setView([firstLocation.lat, firstLocation.lon], 10);
    };

    const Resloc=(loc)=>
    {
        L.marker([loc.lat, loc.lon])
        .addTo(mapRef.current)
        .bindPopup(`<b>${loc.name}</b><br>${loc.searchTags}`)
        .openPopup();
        mapRef.current.setView([loc.lat, loc.lon], 10);
    }
    const filteredLocations = locations.filter(
        (loc) =>
            loc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            loc.searchTags.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div id="locationdiv">
            <div id="left-container">
                <h1>Search Locations</h1>
                <div id="search-container">
                    <input
                        type="text"
                        id="search-box"
                        placeholder="Search state, city, or pincode..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button onClick={searchLocation} id="search-btn"><i className="fas fa-search"></i>
                    </button>
                </div>
                <div
                    id="results-container"
                  
                >
                    <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px", textAlign: "left" }}>
                        Results:
                    </h3>
                    <ul style={{ padding: "0", margin: "0", listStyleType: "none" }}>
                        {filteredLocations.length === 0 ? (
                            <li style={{ padding: "10px", textAlign: "center", fontSize: "16px", color: "#666" }}>
                                No results found
                            </li>
                        ) : (
                            filteredLocations.map((loc, index) => {
                                // Extract mobile number and email from searchTags
                                const mobileMatch = loc.searchTags.match(/mobile:\s*([\d]+)/i);
                                const emailMatch = loc.searchTags.match(/Email:\s*([\w.-]+@[\w.-]+\.\w+)/i);
                                const shopnameMatch = loc.searchTags.match(/Shop Name:\s*([\w\s]+)/i);
                                const mobileNumber = mobileMatch ? mobileMatch[1] : null;
                                const email = emailMatch ? emailMatch[1] : null;
                                const Shopname = shopnameMatch ? shopnameMatch[1].trim() : null;
                                const cleanedSearchTags = loc.searchTags
                                    .replace(/mobile:\s*[\d]+/i, "")
                                    .replace(/Email:\s*[\w.-]+@[\w.-]+\.\w+/i, "")
                                    .replace(/Shop Name:\s*[\w\s]+/i, "");
                                return (
                                    <li
                                        key={index}
                                        onClick={()=>{Resloc(loc)}}
                                        style={{
                                            padding: "10px",
                                            borderBottom: "1px solid #ddd",
                                            fontSize: "16px",
                                            textAlign: "left",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "5px",
                                            cursor:"pointer",
                                        }}
                                    >
                                        <b style={{ fontSize: "17px", color: "#333" }}>{loc.name}</b>
                                        { loc.name!=="Head Office" && loc.name!=="Resellers" &&(
                                        <span>
                                     <strong> ShopName: </strong>
                                            {Shopname}
                                         
                                         </span> 
                                         )}
                                        <span style={{ color: "#555" }}>{cleanedSearchTags.trim()}</span>
                                     
                                        {/* Mobile as clickable link */}
                                        {mobileNumber && (
                                            <a href={`tel:${mobileNumber}`} style={{ color: "#007bff", textDecoration: "none" }}>
                                                📞 {mobileNumber}
                                            </a>
                                        )}
                                        {mobileNumber && (
                                            <a 
                                                href={`https://wa.me/${mobileNumber}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                style={{ color: "#25D366", textDecoration: "none", display: "block" }}
                                            >
                                                💬 Chat on WhatsApp
                                            </a>
                                        )}

                                        {/* Email as clickable link */}
                                        {email && (
                                            <a href={`mailto:${email}`} style={{ color: "#007bff", textDecoration: "none" }}>
                                                ✉️ {email}
                                            </a>
                                        )}
                                    </li>
                                );
                            })
                        )}
                    </ul>

                    <h3 style={{ display: "block", marginBottom: "12px", marginTop: "24px" }}>
                        Contact Details:
                    </h3>
                    <a href="https://wa.me/919498088659" target="_blank" style={{ display: "block", marginBottom: "24px" }}>
                        <img src="/image/whatsapp-icon.png" alt="WhatsApp" style={{ width: "24px", height: "24px" }} />
                        Chat with us
                    </a>
                    <a href="tel:+919498088659" target="_blank" style={{ display: "block" }}>
                        <img src="/image/telephone-icon.png" alt="Call" style={{ width: "24px", height: "24px" }} />
                        Call us
                    </a>
                </div>
            </div>
            <div id="map" ></div>
        </div>
    );
};

export default Location;