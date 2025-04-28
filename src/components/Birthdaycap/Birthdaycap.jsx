import { useState, useRef, useEffect, useContext } from "react";
import React from "react";
import "./Birthdaycap.css"
import { compressImageIfNeeded } from "../imagecompressor/imagecompressor";
import Removebg from "../nameslip/Removebg";
import { processWithImgly } from "../cutoutnameslip/removebgTF";
import TransformControls from "../nameslip/TransformControls";
import { CartContext } from "../CartContext";
import { useNavigate } from "react-router-dom";
import domtoimage from 'dom-to-image-more';

const Birthdaycap = () => {

    const [orderData, setOrderData] = useState(() => {
        try {
            const storedData = JSON.parse(localStorage.getItem("OrderData")) || [];
            return storedData.length > 0 ? storedData[storedData.length - 1] : null;
        } catch (error) {
            console.error("Error parsing OrderData from localStorage:", error);
            return null;
        }
    });
    var editedproduct = JSON.parse(localStorage.getItem("editedproduct"));

    const { addToCart, cartCount } = useContext(CartContext);
    const persImgContRef = useRef(null);
    const [quantity, setQuantity] = useState(1);
    const [price, setprice] = useState(100)
    const navigate = useNavigate();
    const handleAddToCart = async () => {
        if (quantity <= 0) {
            return alert("Set quantity at least 1");
        }

        if (persImgContRef.current) {
            try {
                const node = persImgContRef.current;
                const scale = 1.0;

                const style = {
                    transform: `scale(${scale})`,
                    transformOrigin: 'top left',
                    width: `${node.offsetWidth}px`,
                    height: `${node.offsetHeight}px`,

                };

                const param = {
                    width: node.offsetWidth * scale,
                    height: node.offsetHeight * scale,
                    style,
                    quality: 0.5,
                    bgcolor: null,

                };

                const imageData = await domtoimage.toPng(node, param);

                const productDetails = {
                    image: imageData,
                    quantity: quantity,
                    price: price * quantity,
                    Name: "Birthdaycap",
                    productcode: "BC001",
                    personImage: selectedImage,
                    labels: [{ text: studentname, color: nameTrans.color }]
                };

                const existingCart = JSON.parse(localStorage.getItem("OrderData")) || [];
                existingCart.push(productDetails);
                localStorage.setItem("OrderData", JSON.stringify(existingCart));

                addToCart(); // external function to update cart UI
                localStorage.removeItem("editedproduct");

                alert("Product added to cart successfully!");
                navigate("/Order");

            } catch (error) {
                console.error("Error capturing the div:", error);
            }
        }
    };


    const handlePrice = (e) => {
        setQuantity(e.target.value);
    };
    const customizeDivRefs = useRef({});
    const [activeCustomizeDiv, setActiveCustomizeDiv] = useState(null);
    const calculateFontSize = (
        textLength,
        baseFontSize = window.innerWidth < 768 ? 12 : 19,
        minFontSize = 2
    ) => {
        // Reduce font size as text length increases
        const fontSize = baseFontSize - textLength * 0.5; // Adjust the multiplier (0.5) as needed
        return Math.max(fontSize, minFontSize); // Ensure font size doesn't go below the minimum
    };
    useEffect(() => {
        if (activeCustomizeDiv && customizeDivRefs.current[activeCustomizeDiv]) {
            const div = customizeDivRefs.current[activeCustomizeDiv];

            setTimeout(() => {
                div.scrollIntoView({
                    behavior: "smooth",
                    block: "end",
                    inline: "nearest",
                });

                // Delay to ensure scrolling happens before adjusting the position
                // setTimeout(() => {
                //   window.scrollBy({ behavior: "smooth" });
                // }, 100); // Adjust timing if needed

                div.focus({ preventScroll: true });
                div.blur();
            }, 100);
        }
    }, [activeCustomizeDiv]);

    const [selectedImage, setSelectedImage] = useState(
        sessionStorage.getItem("personImage") || orderData?.personImage || null
    ); const [initialimage, setinitialimage] = useState(null);
    const [loadingimage, setLoadingimage] = useState(null);
    const [studentname, setstudentname] = useState("");
    const [isremovebg, setremovebg] = useState(false);

    const handleDeleteImage = () => {
        setSelectedImage(null);
        setTransformations({
            scale: 1,
            rotate: 0,
            translateX: 0,
            translateY: 0,
            mirror: 1,
        });
    };

    const updateTransform = (type, value, setter) => {
        setter((prev) => ({ ...prev, [type]: prev[type] + value }));
    };
    const toggleMirror = () => {
        setTransformations((prev) => ({
            ...prev,
            mirror: prev.mirror === 1 ? -1 : 1,
        }));
    };

    const toggleCustomizeDiv = (divId) => {
        setActiveCustomizeDiv((prev) => (prev === divId ? null : divId));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setstudentname(value)
        const newFontSize = calculateFontSize(value.length);
        if (name === "name") {
            setNameTrans((prev) => ({ ...prev, fontSize: newFontSize + 10 }));
        }
    }


    const [transformations, setTransformations] = useState({
        scale: 1,
        rotate: -35,
        translateX: 0,
        translateY: 0,
        mirror: 1,
    });
    const studentDetail =
        JSON.parse(sessionStorage.getItem("studentDetails")) || null;

    const fontdetails = JSON.parse(sessionStorage.getItem("detailsFont") || null);
    const [nameTrans, setNameTrans] = useState({
        fontSize: editedproduct?.labels?.[0]?.text?.length
            ? calculateFontSize(editedproduct.labels[0].text.length) : 30,
        scale: 1, // Zoom level
        rotate: 0, // Rotation angle
        translateX: 0, // Horizontal movement
        translateY: 0, // Vertical movement
        mirror: 1,
        color: "#322d95",
    });

    const handleImageChange = async (event) => {
        sessionStorage.removeItem("removebg");

        const file = event.target.files?.[0];
        if (!file) return;

        setLoadingimage(true);

        try {
            const compressedFile = await compressImageIfNeeded(file);

            const base64 = await new Promise((resolve, reject) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(compressedFile);
                fileReader.onloadend = () => resolve(fileReader.result);
                fileReader.onerror = (error) => reject(error);
            });

            setinitialimage(base64);
            sessionStorage.setItem("initialimage", base64);
            sessionStorage.setItem("personImage", base64);
            setSelectedImage(base64)
            await processWithImgly(base64, setSelectedImage, setremovebg);

        } catch (err) {
            console.error("BG removal failed:", err);

        } finally {
            setLoadingimage(false);


        }
    };

    return (
        <div>
            <div className="fullcontainer">
                <div className="cap-container" ref={persImgContRef}>
                    <img src="/Birthdaycap/birthdaycap1.webp" alt="cap" className="cap-bg" />
                    {selectedImage && <img src={selectedImage} alt="user" className="user-img" style={{
                        // border: imageBorder ? "2px solid black" : "none",
                        // borderRadius: circleImage ? "100%" : "0%",
                        // filter: `brightness(${brightness}%) contrast(${contrast}%)`,
                        // zIndex: isimageback ? -100 : 0,
                        transform: `scale(${transformations.scale}) rotate(${transformations.rotate}deg) translate(${transformations.translateX}px, ${transformations.translateY}px) scaleX(${transformations.mirror})`,
                        transition: "transform 0.2s",
                        background: "white"
                    }} />}

                    <svg className="curved-name" width="250" height="65">
                        <defs>
                            <path id="text-curve" d="M 10 10 Q 150 90, 290 10" fill="transparent" />
                        </defs>
                        <use href="#text-curve" stroke="white" strokeWidth="41" fill="none" className="curve-path" />

                        <text fill={nameTrans.color} fontSize="18" fontWeight="bold" style={{
                            fontSize: `${nameTrans.fontSize}px`,
                            position: "absolute",
                            transform: `scale(${nameTrans.scale}) rotate(${nameTrans.rotate}deg) translate(${nameTrans.translateX}px, ${nameTrans.translateY}px) scaleX(${nameTrans.mirror})`,
                            transition: "transform 0.2s",
                        }}
                        >
                            <textPath href="#text-curve" startOffset={window.innerWidth < 768 ? "30%" : "45%"} textAnchor="middle" >
                                {studentname}
                            </textPath>
                        </text>
                    </svg>

                </div>


                <div className="half-column2">
                    <div className="selectimagediv">
                        <label htmlFor="select-image" id="sel-img-btn" className="bc-btn">
                            Select Your image
                        </label>

                        <input
                            type="file"
                            id="select-image"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        <button
                            onClick={() => toggleCustomizeDiv("customizediv-bc")}
                            style={{ width: "75px " }}
                        >
                            <img
                                src="/image/custamize.png"
                                style={{ width: "25px " }}
                                alt=""
                                className="custamlogo"
                            />
                        </button>

                        {activeCustomizeDiv === "customizediv-bc" && (




                            <div
                                id="customizediv-bc"
                                ref={(el) => (customizeDivRefs.current["customizediv-bc"] = el)}
                                tabIndex={-1}
                            >
                                <TransformControls
                                    onUpdateTransform={(type, value) =>
                                        updateTransform(type, value, setTransformations)
                                    }
                                    div={"customizediv"}
                                />
                                <div
                                    style={{
                                        display: "flex",
                                        margin: "4%",
                                        marginLeft: "20%",
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    <button onClick={toggleMirror}>
                                        {transformations.mirror === 1
                                            ? "Mirror Image"
                                            : "Unmirror Image"}
                                    </button>
                                    <Removebg
                                        selectedImage={selectedImage}
                                        setSelectedImage={setSelectedImage}
                                        initialimage={initialimage}
                                        cutout={"cutout"}
                                        isremovebg={isremovebg}
                                        setremovebg={setremovebg}
                                    />
                                </div>

                            </div>
                        )}
                    </div>

                    <div className="student-namecolumn">

                        <strong>Name:</strong><input
                            type="text"
                            name="name"
                            placeholder="Enter Your Name"
                            value={studentname}
                            onInput={handleInputChange}
                            className="student-name23"
                        />

                        {/* <button onClick={() => toggleCustomizeDiv("namecustomizediv-bc")} className="bc-btn">
                        <img
                            src="/image/custamize.png"
                            width={"25px"}
                            alt=""
                            className="custamlogo"
                        />
                    </button> */}
                        <div
                            id="namecustomizediv-bc"
                            ref={(el) =>
                                (customizeDivRefs.current["namecustomizediv-bc"] = el)
                            }
                            tabIndex={-1}
                        >
                            <TransformControls
                                onUpdateTransform={(type, value) =>
                                    type === "color"
                                        ? setNameTrans((prev) => ({ ...prev, [type]: value }))
                                        : setNameTrans((prev) => ({
                                            ...prev,
                                            [type]: prev[type] + value,
                                        }))
                                }
                                fontSize={nameTrans.fontSize * nameTrans.scale}
                            />
                        </div>
                    </div>
                    <div id="quantity">
                        Quantity
                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={handlePrice}
                            style={{ width: "50px" }}
                        />
                    </div>
                    <label id="price">
                        price <span>&#8377;</span>
                        {price * quantity}
                    </label>

                    <button id="add" onClick={handleAddToCart}>
                        <i className="fa-solid fa-cart-plus"></i> Add to cart
                    </button>
                    <div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Birthdaycap
