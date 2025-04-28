import { useEffect, useState, useContext, useRef } from "react";
import "./Order.css";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../CartContext";
import JSZip from "jszip";
import Googleform from "./Googleform";
import Swal from "sweetalert2";
import Birthdaycap from "../birthdaycapfolder/Birthdaycap";
import { toast } from "react-toastify";
// import { useParams } from 'react-router-dom';
// import { use } from 'react';

const Order = ({ handleEditOrder, orderData, setOrderData, coupon }) => {
  const navigate = useNavigate();
  const [selectedvalue, setselectedvalue] = useState("normal");
  const [whatsapp, setwhatsapp] = useState(null);
  // const [orderData, setOrderData] = useState([]);
  const [deliveryMode, setDeliveryMode] = useState("normal-delivery");
  const [paymentMode, setPaymentMode] = useState("online-payment");
  const [isReseller, setIsReseller] = useState(false);
  const [prodPrice, setProdPrice] = useState(0);
  const [delPrice, setDelPrice] = useState(50); // Default to normal delivery charge
  const [cod, setCod] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const { cartCount, removeFromCart, oneplus1diff } = useContext(CartContext);
  // const [quantity, setQuantity] = useState(0);
  const [couponUsed, setCouponUsed] = useState(false); // Flag to track coupon usage
  const [couponCode, setCouponCode] = useState("");
  const [initalprodprice, setInitialPrice] = useState(0);
  const [isVisible, setvisible] = useState(false);
  const [visiblerp, setvisiblerp] = useState(false);
  const [zipFile, setZipFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [orderid, setorderid] = useState("");
  const [orderid2, setOrderId2] = useState("");
  const [iserror, seterror] = useState(false);
  const [discount1, setdiscount1] = useState(0);
  const [rescoup, setRescoup] = useState();
  const [influencer, setInfluencer] = useState(false);
  const [offercount, setOffercount] = useState(
    localStorage.getItem("offercount") || null
  );
  const [resellerformdata, setResellerformdata] = useState();
  const [isClicked, setIsClicked] = useState(false);
  const fc = JSON.parse(localStorage.getItem("FormContainer")) || "";
  const p = [];
  const [pincode, setpincode] = useState(null);
  //  var productName=orderData.product.productcode.startsWith('NS')?'nameslip':product.productcode.startsWith('NSCRT')?"cutoutNameslip":"";
  //  const [labelType, setLabelType]=useState('matte');


  const hasShownRef = useRef(false);

  useEffect(() => {
    if (cartCount % 2 === 1 && !hasShownRef.current && oneplus1diff > 5) {
      toast.success("Almost there—add 1 more for your FREE gift!", {
        autoClose: 5000
      });
      hasShownRef.current = true;
    } else if (cartCount % 2 === 0) {
      hasShownRef.current = false;
    }
  }, [cartCount]);

  window.onerror = function (message, source, lineno, colno, error) {

    if (error?.message?.toLowerCase().includes("startswith")) {

      console.error("Error detected with startsWith:", error);
      localStorage.removeItem("OrderData");
      localstorage.removeItem("editedproduct")
      window.location.reload();
    }
  };
  const showAlert = () => {
    Swal.fire({
      title: 'You got a free Shipping',
      icon: 'Success',
      timer: 1500,
      timerProgressBar: true,
      showConfirmButton: true,
      position: 'top',
    });
  };
  const offer = JSON.parse(sessionStorage.getItem("Nameslipoffer")) || JSON.parse(sessionStorage.getItem("cutoutoffer"))

  useEffect(() => {
    if (offer && paymentMode !== "online-payment") {
      let addamount = 0
      let allprodprice = 0

      const updatedcart = orderData.map((prod) => {

        if (prod.productcode.startsWith("NSCRT")) {

          addamount = 340
          allprodprice += 340
        }
        else if (prod.productcode.startsWith("NS")) {

          addamount = 100
          allprodprice += 100
        }
        return {
          ...prod,
          price: addamount,
        };
      })
      if (JSON.stringify(orderData) !== JSON.stringify(updatedcart)) {

        setOrderData(updatedcart);
      }
      setProdPrice(allprodprice);
    }

    if (offer && paymentMode === "online-payment") {
      const offercutout = JSON.parse(sessionStorage.getItem("cutoutoffer"))
      const offernameslip = JSON.parse(sessionStorage.getItem("Nameslipoffer"))
      let addamount = 0
      let allprodprice = 0
      const updatedcart = orderData.map((prod) => {

        if (prod.productcode.startsWith("NSCRT")) {

          addamount = Math.round(parseInt(offercutout?.original_price)
            * (1 - parseInt(offercutout.
              offer_percentage) / 100)
          ) || 340;
          allprodprice += Math.round(parseInt(offercutout?.original_price)
            * (1 - parseInt(offercutout?.
              offer_percentage) / 100)
          ) || 340;
        }
        else if (prod.productcode.startsWith("NS")) {

          if (prod.labeltype === "glossy") {
            addamount = Math.round(parseInt(offernameslip?.original_price_glossy)
              * (1 - parseInt(offernameslip?.
                offer_percentage_glossy) / 100)
            ) || 160;
            allprodprice += Math.round(parseInt(offernameslip?.original_price_glossy)
              * (1 - parseInt(offernameslip?.
                offer_percentage_glossy) / 100)
            ) || 160
          }
          else {
            addamount = Math.round(parseInt(offernameslip?.original_price_matte)
              * (1 - parseInt(offernameslip?.
                offer_percentage_matte) / 100)
            ) || 100;

            allprodprice += Math.round(parseInt(offernameslip?.original_price_matte)
              * (1 - parseInt(offernameslip?.
                offer_percentage_matte) / 100)
            ) || 100
          }
        }
        return {
          ...prod,
          price: addamount,
        };

      })

      if (JSON.stringify(orderData) !== JSON.stringify(updatedcart)) {

        setOrderData(updatedcart);
      }
      setProdPrice(allprodprice);

    }
  }, [paymentMode])

  const resetprice = () => {

    let addamount = 0
    let allprodprice = 0
    const updatedcart = orderData.map((prod) => {

      if (prod.productcode.startsWith("NSCRT")) {

        addamount = 340;
        allprodprice += 340;
      }
      else if (prod.productcode.startsWith("NS")) {

        if (prod.labeltype === "glossy") {
          addamount = 160;
          allprodprice += 160
        }
        else {
          addamount = 100;

          allprodprice += 100
        }
      }
      return {
        ...prod,
        price: addamount,
      };

    })

    if (JSON.stringify(orderData) !== JSON.stringify(updatedcart)) {

      setOrderData(updatedcart);
    }
    setProdPrice(allprodprice);

  }



  useEffect(() => {
    if (oneplus1diff > 5) {
      let nscrtprice0 = 0;
      let nsprice0 = 0;
      let nscrtprice = 0;
      let nsprice = 0;
      let addamount = 0;
      let i = 0;
      let allprodprice = 0;
      if (paymentMode === "online-payment") {
        const updatedCart = orderData.map((prod) => {

          if (prod.productcode.startsWith("NSCRT")) {
            if (prod.price === 0) {
              nscrtprice0 += 1;
            }
            nscrtprice += 1;
          } else if (prod.productcode.startsWith("NS")) {
            if (prod.price === 0) {
              nsprice0 += 1;
            }
            nsprice += 1;
          }
          return prod;
        });

        let finalCart = [...orderData];

        // if (nscrtprice0 > nscrtprice - nscrtprice0) {
        let j = 0;
        finalCart = orderData.map((prod) => {
          if (j <= nscrtprice) {
            if (prod.productcode.startsWith("NSCRT")) {
              if (j % 2 === 0) {
                addamount = 340;
              } else {
                addamount = 0;
              }
              allprodprice += addamount;
              j += 1;
              return { ...prod, price: addamount };
            }
          }
          return prod;
        });

        if (JSON.stringify(orderData) !== JSON.stringify(finalCart)) {
          setOrderData(finalCart);
        }
        // }
        j = 0;
        finalCart = orderData.map((prod) => {
          if (j <= nsprice) {
            if (prod.productcode.startsWith("NSCRT")) { }
            else if (prod.productcode.startsWith("NS")) {
              if (j % 2 === 0) {
                addamount = 100;
              } else {
                addamount = 0;
              }
              allprodprice += addamount;
              j += 1;
              return { ...prod, price: addamount };
            }
          }
          return prod;
        });

        if (JSON.stringify(orderData) !== JSON.stringify(finalCart)) {
          setOrderData(finalCart);
        }

        else {

          allprodprice = orderData.reduce((sum, prod) => sum + prod.price, 0);
        }

        setProdPrice(allprodprice);
      }
      else {
        resetprice()
      }
    }
  }, [orderData, cartCount, paymentMode]);



  useEffect(() => {
    if (offer) {
      if (parseInt(pincode) > 600000 && parseInt(pincode) < 600118 && paymentMode === "online-payment") {
        setDelPrice(0)
        showAlert()
      }
      else {
        setDelPrice(50)
      }
    }
  }, [pincode, paymentMode, deliveryMode])

  useEffect(() => {
    const rsc = localStorage.getItem("Rescoup") || "";
    let discount = 0;

    const updatedcart = orderData.map((prod) => {
      let discountAmount = 0;

      if (isReseller) {
        if (rsc.startsWith("RP")) {
          discountAmount =
            prod.labeltype === "matte"
              ? (85 * prod.price) / 100
              : (87.5 * prod.price) / 100;
        } else if (rsc.startsWith("RO")) {
          discountAmount =
            prod.labeltype === "matte"
              ? (10 * prod.price) / 100
              : (18.75 * prod.price) / 100;
        }
      }

      discount += discountAmount;

      return {
        ...prod,
        discountedPrice: prod.price - discountAmount,
      };
    });

    setdiscount1(discount);
    const newPrice = prodPrice - discount;
    if (JSON.stringify(orderData) !== JSON.stringify(updatedcart)) {

      setOrderData(updatedcart);
    }
    setProdPrice(newPrice);
    setCouponUsed(true);

    // localStorage.setItem("OrderData", JSON.stringify(updatedcart));

  }, [isReseller]);

  const generateRandomString = (length = 5) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  };

  useEffect(() => {
    const storedOrderData = JSON.parse(localStorage.getItem("OrderData")) || [];
    setOrderData(storedOrderData);
    getPrice(storedOrderData);

    const pdetails = JSON.parse(localStorage.getItem("productDetails")) || [];
    p.push(pdetails);
    const resellerStatus = localStorage.getItem("ResellerLogin");
    setIsReseller(resellerStatus);

    createZipFile(storedOrderData);

    const rsc = localStorage.getItem("Rescoup") || "";
    // setRescoup(`#${rsc}`);
    // setCouponCode(`#${rsc}`);
  }, []);

  useEffect(() => {
    const now = Date.now(); // UTC timestamp in ms

    const expiredProducts = orderData.filter((prod) => {
      const prodDate = Date.parse(prod.datetime); // Parse to UTC ms timestamp
      const diffInMs = now - prodDate;
      const diffInMinutes = diffInMs / (1000 * 60);

      return diffInMinutes >= 10080; // or whatever threshold you need
    });

    if (expiredProducts.length > 0) {
      expiredProducts.forEach((prod) => removeProduct(prod));
    }
  }, [orderData]); // Dependency array added here in case `orderData` updates dynamically

  const removeProduct = (prod) => {

    const updatedCart = orderData.filter((item) => item !== prod);
    localStorage.setItem("OrderData", JSON.stringify(updatedCart));
    setOrderData(updatedCart);
    getPrice(updatedCart);
    removeFromCart();
    if (prod.type === "Bulk orders") {
      localStorage.removeItem("zipFileData");
      localStorage.removeItem("excelfile");
    }
  };

  useEffect(() => {
    if (isReseller) {
      const selfPickupBtn = document.getElementById("selfpickup");
      if (selfPickupBtn) {
        selfPickupBtn.click();
      }
      const userData = JSON.parse(localStorage.getItem("resellerform"));
      setResellerformdata({
        id: userData.id || "",
        name: userData.name || "",
        email: userData.email || "",
        password: userData.password || "",
        mobileno: userData.mobileno || "",
        whatsappno: userData.whatsappno || "",
        products: Array.isArray(userData.products)
          ? userData.products
          : JSON.parse(userData.products || "[]"),
        walkin: userData.walkin || "no",
        chekin: userData.chekin || "no",
        courier: userData.courier || "no",
        offercount: userData.offercount || 0,
      });
    }
  }, [isReseller]);
  useEffect(() => {
    if (rescoup && offercount > 0 && validateCouponCode(rescoup)) {
      setCouponCode(rescoup);
      handleSubmitCoupon();
      if (isReseller) {
        document.getElementById("resellerdisplay").style.display = "none";
      }
    }
  }, [rescoup]);
  useEffect(() => {
    if (coupon.length > 0) {
      setCouponCode(coupon);
      //  handleSubmitCoupon();
    }

  }, []);

  const createZipFile = async (orderData) => {
    const zip = new JSZip();
    for (const [index, item] of orderData.entries()) {
      if (item?.image) {
        const base64Data = item.image.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = atob(base64Data);
        const arrayBuffer = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          arrayBuffer[i] = binaryData.charCodeAt(i);
        }
        zip.file(`order_image_${index + 1}.png`, arrayBuffer);
      }
    }
    const content = await zip.generateAsync({ type: "blob" });
    setZipFile(content);
  };

  useEffect(() => {
    // Recalculate total whenever relevant states change
    const total = prodPrice + delPrice + cod;
    setTotalPrice(total);
  }, [prodPrice, delPrice, cod]);

  const getPrice = (data) => {
    let productTotal = 0;
    // let quantityTotal = 0;

    data.forEach((prod) => {
      const productPrice = parseInt(prod.price, 10);
      const productQuantity = parseInt(prod.quantity, 10);
      // setLabelType(prod.labeltype);

      if (!isNaN(productPrice) && !isNaN(productQuantity)) {
        productTotal += productPrice;
        // quantityTotal += productQuantity;
      }
    });
    setProdPrice(productTotal);
    setInitialPrice(productTotal);
    // setQuantity(quantityTotal);
  };

  const handleDeliveryChange = (e) => {

    const selectedDeliveryMode = e.target.value;
    setDeliveryMode(selectedDeliveryMode);

    // Update delivery price based on selected mode
    if (selectedDeliveryMode === "normal-delivery") {
      selectedvalue === "instant" ? setDelPrice(70) : setDelPrice(50);
    } else if (selectedDeliveryMode === "express-delivery") {
      selectedvalue === "instant" ? setDelPrice(120) : setDelPrice(100);
    } else if (selectedDeliveryMode === "Self-pick up") {
      selectedvalue === "instant" ? setDelPrice(20) : setDelPrice(0);
    }
  };

  const handlePaymentChange = (e) => {
    setPaymentMode(e);
    if (e === "online-payment") {
      setCod(0);
      document.getElementById("cod1").style.display = "none";
      document.getElementById("partial").style.display = "none";
      setPaymentMode("online-payment");
    } else if (e === "partial-payment") {

      setCod(40);
      document.getElementById("cod1").style.display = "block";
      document.getElementById("partial").style.display = "block";
      setPaymentMode("partial-payment");
    } else if (e === "cashon-payment") {
      setPaymentMode("cashon-payment");
      // alert("We Don't Support Full Cash On Payment For Now. Please Contact Our Nearest Reseller !");
      // navigate('/fullcashondelivery');
    }
  };

  const validateCouponCode = (code) => {
    if (
      !code.startsWith("#RO") &&
      !code.startsWith("#RP") &&
      !code.startsWith("#RP$") &&
      !code.startsWith("#INF") &&
      !code.startsWith("DISCOUNT")
    )
      return false;
    if (code.startsWith("#RP$")) {
      const numberPart = code.slice(4);

      return /^\d{10}$/.test(numberPart);
    }
    if (code.startsWith("#INF")) {
      const numberPart = code.slice(4);
      return /^\d{10}$/.test(numberPart);
    }
    if (code.startsWith("DISCOUNTCONSR50")) {
      return true;
    }
    if (code.startsWith("DISCOUNTCONSP10")) {
      return true;
    }
    if (code.startsWith("DISCOUNTNSR20")) {
      return true;
    }
    if (code.startsWith("DISCOUNTNSP10")) {
      return true;
    }
    if (code.startsWith("DISCOUNTCONSFSH")) {
      return true;
    }
    if (code.startsWith("DISCOUNTNSFHSH")) {
      return true;
    }
    const numberPart = code.slice(3);
    return /^\d{10}$/.test(numberPart);
  };

  // Common function to apply the coupon logic
  const applyCoupon = (code) => {
    if (offercount == 0) {
      alert("Promocode reached limit. So continue shopping without offer");
      return;
    }
    if (!code) return;

    let discount = 0;
    const isRPOffer = code.startsWith("#RP");
    const isRPdollor = code.startsWith("#RP$");
    const isRO = code.startsWith("#RO");
    const inf = code.startsWith("#INF");
    const isdiscountCONS = code.startsWith("DISCOUNTCONSR50");
    const isdiscountCONSP10 = code.startsWith("DISCOUNTCONSP10");

    const updatedOrderData = orderData.map((prod) => {
      let discountAmount = 0;
      if (isdiscountCONS && prod.productcode.startsWith("NSCRT")) {
        discountAmount = 50;
      }
      if (isdiscountCONSP10 && prod.productcode.startsWith("NSCRT")) {
        discountAmount = (10 * prod.price) / 100;
      }
      if (code === "DISCOUNTCONSFSH") {
        setDelPrice(0);
      }
      if (code === "DISCOUNTNSFHSH") {
        setDelPrice(delPrice / 2);
      }
      if (code === "DISCOUNTNSR20" && prod.productcode.startsWith("NSHRT")) {
        discountAmount = 20;
      }
      if (code === "DISCOUNTNSP10" && prod.productcode.startsWith("NSHRT")) {
        discountAmount = (10 * prod.price) / 100;
      }
      if (isRPOffer) {
        document.getElementById("resellerdisplay").style.display = "none";
        setvisiblerp(true);
        discountAmount =
          prod.labeltype === "matte"
            ? (85 * prod.price) / 100
            : (87.5 * prod.price) / 100;
      }
      if (isRPdollor) {
        document.getElementById("resellerdisplay").style.display = "none";
        setvisiblerp(true);
        discountAmount =
          prod.labeltype === "matte"
            ? (70 * prod.price) / 100
            : (68.75 * prod.price) / 100;
      }
      if (isRO) {
        document.getElementById("resellerdisplay").style.display = "none";
        setvisible(true);
        discountAmount =
          prod.labeltype === "matte"
            ? (10 * prod.price) / 100
            : (18.75 * prod.price) / 100;
      }
      if (inf) {
        document.getElementById("resellerdisplay").style.display = "block";
        // setvisible(true);
        setInfluencer(true);
        discountAmount =
          prod.labeltype === "matte"
            ? (100 * prod.price) / 100
            : (100 * prod.price) / 100;
      }
      discount += discountAmount;
      setdiscount1(discount);

      return {
        ...prod,
        discountedPrice: prod.price - discountAmount,
      };
    });

    const newPrice = prodPrice - discount;
    setOrderData(updatedOrderData);
    setProdPrice(newPrice);
    setCouponUsed(true);
    alert("Coupon applied! Total Price after discount: ₹" + newPrice);
  };

  // Handle manual coupon entry
  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  // Handle coupon submission (manual entry)
  const handleSubmitCoupon = () => {
    setIsClicked(true);
    if (offercount == 0) {
      alert("Promocode reached limit. So continue shopping without offer");
      return;
    }
    if (!couponCode) {
      setProdPrice(initalprodprice);
      document.getElementById("resellerdisplay").style.display = "block";
      setvisible(false);
      setvisiblerp(false);
      alert("Please enter a coupon code!");
      return;
    }

    if (validateCouponCode(couponCode) && !couponUsed) {
      applyCoupon(couponCode);
    } else if (couponUsed) {
      setProdPrice(initalprodprice);
      setCouponUsed(false);
      document.getElementById("resellerdisplay").style.display = "block";
    } else {
      if (deliveryMode === "normal-delivery") {
        setDelPrice(50);
      } else if (deliveryMode === "express-delivery") {
        setDelPrice(100);
      }
      document.getElementById("resellerdisplay").style.display = "block";
      alert("Invalid coupon code!");
      setvisiblerp(false);
    }
  };

  const handleSelectOption = (e) => {
    var selectedValue = e.target.value;
    setselectedvalue(e.target.value);
    if (selectedValue === "forcustomer") {
      setProdPrice(initalprodprice); // Reset to original price
      setCouponUsed(false); // Unmark the coupon
      setvisible(false);
      setdiscount1(0);
      document.getElementById("resellerdisplay").style.display = "block"; // Hide the visibility flag
    } else if (selectedValue === "formyself" && couponCode && !couponUsed) {
      // Reapply the coupon logic

      if (validateCouponCode(couponCode)) {
        const discount = Math.round((10 * initalprodprice) / 100);
        const newPrice = initalprodprice - discount;
        setProdPrice(newPrice); // Apply the discount
        setCouponUsed(true); // Mark the coupon as used
        setvisible(true);
        setdiscount1(discount);
        // Show the visibility flag
      } else {
        setdiscount1(0);
        alert("Invalid coupon code for reapplication!");
      }
    } else if (selectedValue === "instant" && couponCode) {
      deliveryMode === "normal-delivery"
        ? setDelPrice(70)
        : deliveryMode === "express-delivery"
          ? setDelPrice(120)
          : deliveryMode === "Self-pick up"
            ? setDelPrice(20)
            : "";
    } else if (selectedValue === "normal" && couponCode) {
      deliveryMode === "normal-delivery"
        ? setDelPrice(50)
        : deliveryMode === "express-delivery"
          ? setDelPrice(100)
          : deliveryMode === "Self-pick up"
            ? setDelPrice(0)
            : "";
    }
    sessionStorage.setItem("Instant", e.target.value);
  };

  const handleProceedToPayment = async () => {
    const deliveryDetails = {
      deliveryMode,
      paymentMode,
      prodPrice,
      delPrice,
      cod,
      totalPrice,
    };

    const productDetails =
      Array.isArray(orderData) && orderData.length > 0
        ? orderData.map((product) => {
          const labels = Array.isArray(product.labels) ? product.labels : [];

          const selectedlabel = localStorage.getItem("selectedlabel") || "";
          const dynamicKey =
            selectedlabel === "/image/waterlabel/4.png"
              ? "contact no"
              : "rollno";
          return {
            ProdName: product.Name,
            productcode: product.productcode,
            product: product.productcode.startsWith("NS")
              ? "nameslip"
              : product.productcode?.startsWith("NSCRT")
                ? "cutoutNameslip"
                : "",
            price: product.price,
            size: product.size,
            quantity: product.quantity,
            subquantity: product?.size?.includes("OneSheet totally")
              ? "4 sheets"
              : "3 sheets",
            type: product.labeltype,
            name: labels[0]?.text || "",
            "name fontsize": labels[0]?.fontSize || "",
            "name fontColor": labels[0]?.fontColor || "",
            "name fontFamily": labels[0]?.fontFamily || "",
            "name fontStyle": labels[0]?.fontStyle || "",
            school: labels[1]?.text || "",
            "school fontsize": labels[1]?.fontSize || "",
            "school fontColor": labels[1]?.fontColor || "",
            "schooln fontFamily": labels[1]?.fontFamily || "",
            "school fontStyle": labels[1]?.fontStyle || "",
            class: labels[5]?.text || "",
            "class fontsize": labels[5]?.fontSize || "",
            "class fontColor": labels[5]?.fontColor || "",
            "class fontFamily": labels[5]?.fontFamily || "",
            "class fontStyle": labels[5]?.fontStyle || "",
            section: labels[4]?.text || "",
            "section fontsize": labels[4]?.fontSize || "",
            "section fontColor": labels[4]?.fontColor || "",
            "section fontFamily": labels[4]?.fontFamily || "",
            "section fontStyle": labels[4]?.fontStyle || "",
            [dynamicKey]: labels[3]?.text || "",
            [`${dynamicKey} fontsize`]: labels[3]?.fontSize || "",
            [`${dynamicKey} fontColor`]: labels[3]?.fontColor || "",
            [`${dynamicKey} fontFamily`]: labels[3]?.fontFamily || "",
            [`${dynamicKey} fontStyle`]: labels[3]?.fontStyle || "",
            subject: labels[2]?.text || "",
            "subject fontsize": labels[2]?.fontSize || "",
            "subject fontColor": labels[2]?.fontColor || "",
            "subject fontFamily": labels[2]?.fontFamily || "",
            "subject fontStyle": labels[2]?.fontStyle || "",
            "subject Position": labels[2]?.position || "",
          };
        })
        : [];

    // localStorage.setItem('productDetails', JSON.stringify(productDetails));

    const form = document.getElementById("address-form");
    const formData = {
      version: "Dreamik.com_v1.1",
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      whatsappno: form.whatsappno.value.trim(),
      address1: localStorage.getItem("address1") || form.address1.value.trim(),
      address2: form.address2.value.trim(),
      pincode: form.pincode.value.trim(),
      district: form.district.value.trim(),
      state: localStorage.getItem("state") || form.state.value.trim(),
      landmark: form.landmark.value.trim(),
      customertype: isReseller ? "reseller" : "customer",
      discount: discount1,
      shippingcost: delPrice,
      resellerid: localStorage.getItem("Rescoup") || "NIL",
      coupon: couponCode,
      totalprice: totalPrice,
      deliverymode: deliveryMode,
      paymentmode: paymentMode,
      // Destructure to exclude 'image'
      productDetails: productDetails ? [...productDetails, ...p] : p,
      additionalDetails: {
        orderTime: new Date().toString(), // Timestamp of when the order was placed
        browserDetails: navigator.userAgent, // Browser details
      },
    };

    localStorage.setItem(
      "PriceData",
      JSON.stringify({ prodPrice, delPrice, cod, totalPrice })
    );
    localStorage.setItem("PaymentDetails", JSON.stringify(deliveryDetails));
    localStorage.setItem("FormContainer", JSON.stringify(formData));

    if (paymentMode !== "cashon-payment") {
      if (influencer) {
        setIsLoading(true);
        const now = new Date();
        const orderId = `INF-${formData.name}${now
          .toISOString()
          .replace(/[-:.TZ]/g, "")}-${generateRandomString()}-v1`;
        setorderid(orderId);
        var resellerid = "INF";

        let OrderId2; // Define it outside so it's accessible later

        try {
          const res = await fetch(
            "https://0xij5t5kzk.execute-api.ap-south-1.amazonaws.com/prod/generate-id",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                invoiceid: orderId,
                requesterid: resellerid,
                requestmobil: form.phone.value.trim(),
                option: "none",
              }),
            }
          );

          if (res.ok) {
            const data = await res.json(); // Await the JSON parsing
            OrderId2 = data.orderid; // Extract order ID
            setOrderId2(OrderId2);
          } else {
            console.log("Request failed:", res.status, res.statusText);
          }
        } catch (e) {
          console.error("Error:", e);
        }

        const orderDetails = {
          orderId,
          OrderId2,
          orderData,
          paymentDetails: {
            PaymentMode: paymentMode,
            DeliveryMode: deliveryMode,
          },
          formContainer: formData,
          priceDetails: { prodPrice, delPrice, cod, totalPrice },
        };

        localStorage.setItem(
          "OrderConfirmationData",
          JSON.stringify(orderDetails)
        );
        try {
          const uploadForm = new FormData();
          const infoBlob = new Blob([JSON.stringify(formData)], {
            type: "application/json",
          });
          uploadForm.append("info", infoBlob, "info.json");
          uploadForm.append("orderId", orderId);
          if (zipFile) {
            uploadForm.append("zipfiles", zipFile, "order_images.zip");
          }

          const response = await fetch(
            "https://dreamik-intern.onrender.com/upload",
            {
              method: "POST",
              body: uploadForm,
            }
          );

          if (response.ok) {
            alert("Successfully Order saved.!");
            //reseller offercount logic.. to update in sql
            if (offercount) {
              const newCount = Math.max(offercount - 1, 0);
              setOffercount(newCount); //
              localStorage.setItem("offercount", newCount); //
              resellerformdata.offercount = newCount;

              await fetch(
                `https://dreamik-intern.onrender.com/updateReseller/${resellerformdata.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(resellerformdata),
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  if (data.message === "User not found") {
                    console.log("reseller offercount not updated check id.");
                  } else if (data.message === "User updated successfully") {
                    console.log("reseller offercount updated successfully!");
                  }
                });
            }

            navigate("/orderconfirmation");
            seterror(null);
          } else {
            const errorMessage = await response.text();
            alert(
              `Failed to save order. Please try again.\nError: ${errorMessage}`
            );
            //google form
            seterror(true);
          }
        } catch (e) {
          console.error("Error uploading files:", e);
          alert(
            "An error occurred while uploading the files. Please check your connection and try again."
          );
          //google form
          seterror(true);
        } finally {
          setIsLoading(false);
        }
      } else {
        navigate("/payment");
      }
    } else {
      setIsLoading(true);
      const now = new Date();
      const orderId = `COD-order-${formData.name}${now
        .toISOString()
        .replace(/[-:.TZ]/g, "")}-${generateRandomString()}-v1`;
      setorderid(orderId);
      var resellerid = couponCode
        ? couponCode.startsWith("RP$")
          ? `RP$${form.phone.value.trim()}`
          : `${couponCode.slice(1, 3)}${form.phone.value.trim()}`
        : "CS";

      let OrderId2; // Define it outside so it's accessible later

      try {
        const res = await fetch(
          "https://0xij5t5kzk.execute-api.ap-south-1.amazonaws.com/prod/generate-id",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              invoiceid: orderId,
              requesterid: resellerid,
              requestmobil: form.phone.value.trim(),
              option: "none",
            }),
          }
        );

        if (res.ok) {
          const data = await res.json(); // Await the JSON parsing
          OrderId2 = data.orderid; // Extract order ID
          setOrderId2(orderid2);
        } else {
          console.log("Request failed:", res.status, res.statusText);
        }
      } catch (e) {
        console.error("Error:", e);
      }

      const orderDetails = {
        orderId,
        OrderId2,
        orderData,
        paymentDetails: {
          PaymentMode: paymentMode,
          DeliveryMode: deliveryMode,
        },
        formContainer: formData,
        priceDetails: { prodPrice, delPrice, cod, totalPrice },
      };

      localStorage.setItem(
        "OrderConfirmationData",
        JSON.stringify(orderDetails)
      );
      try {
        const uploadForm = new FormData();
        const infoBlob = new Blob([JSON.stringify(formData)], {
          type: "application/json",
        });
        uploadForm.append("info", infoBlob, "info.json");
        uploadForm.append("orderId", orderId);
        if (zipFile) {
          uploadForm.append("zipfiles", zipFile, "order_images.zip");
        }

        const response = await fetch(
          "https://dreamik-intern.onrender.com/upload",
          {
            method: "POST",
            body: uploadForm,
          }
        );

        if (response.ok) {
          alert("Order saved.! Our Nearest Reseller will Contact you!");
          if (offercount) {
            const newCount = Math.max(offercount - 1, 0);
            setOffercount(newCount); //
            localStorage.setItem("offercount", newCount); //
            resellerformdata.offercount = newCount;

            await fetch(
              `https://dreamik-intern.onrender.com/updateReseller/${resellerformdata.id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(resellerformdata),
              }
            )
              .then((response) => response.json())
              .then((data) => {
                if (data.message === "User not found") {
                  console.log("reseller offercount not updated check id.");
                } else if (data.message === "User updated successfully") {
                  console.log("reseller offercount updated successfully!");
                }
              });
          }

          navigate("/orderconfirmation");
          seterror(null);
        } else {
          const errorMessage = await response.text();
          alert(
            `Failed to save order. Please try again.\nError: ${errorMessage}`
          );
          //google form
          seterror(true);
        }
      } catch (e) {
        console.error("Error uploading files:", e);
        alert(
          "An error occurred while uploading the files. Please check your connection and try again."
        );
        //google form
        seterror(true);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddProduct = () => {
    window.location.href = "/"; // Redirect to add product page
  };

  function fetchLocation(e) {
    const pincode = e;
    setpincode(e)

    if (pincode.length === 6) {
      // Example: Call to an external API to get district and state based on pincode
      fetch(`https://api.postalpincode.in/pincode/${pincode}`)
        .then((response) => response.json())
        .then((data) => {
          if (data[0].Status === "Success") {
            const postOffice = data[0].PostOffice[0];
            document.getElementById("district").value = postOffice.District;
            document.getElementById("state").value = postOffice.State;
          } else {
            document.getElementById("district").value = "";
            document.getElementById("state").value = "";
            alert("Invalid Pincode!");
          }
        })
        .catch((error) => {
          console.error("Error fetching location data:", error);
        });
    } else {
      document.getElementById("district").value = "";
      document.getElementById("state").value = "";
    }
  }

  return (
    <div>
      {/* Loading Overlay */}
      {isLoading ? (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <p className="mt-2 text-center text-gray-700">
            Saving Order, Please wait...
          </p>
          <p>
            This is Your invoice id: <strong>{orderid}</strong>
          </p>
          {/* <p>This is Your orderId: <strong>{orderid2}</strong></p> */}
        </div>
      ) : (
        <div id="container">
          <div id="product-display">
            {orderData.map((prod, index) => (
              <div key={index} className="product-container">
                <img src={prod.image} alt={prod.Name} className="prod-image" />
                <h2 className="prod-name">
                  {prod.productcode}:
                  {prod.productcode.startsWith("NS")
                    ? "nameslip"
                    : prod.productcode.startsWith("NSCRT")
                      ? "cutoutNameslip"
                      : ""}{" "}
                  {prod.Name}
                </h2>
                {Array.isArray(prod.labels) &&
                  prod.labels[2] &&
                  prod.labels[2].subjectCount && (
                    <h2 style={{ fontSize: "16px", lineHeight: "7px" }}>
                      SubjectCount: {prod.labels[2].subjectCount}
                    </h2>
                  )}{" "}{prod.Name !== 'Birthdaycap' &&
                    <h2 className="prod-type">
                      Type:{" "}
                      {prod?.labeltype?.replace(/^./, (char) => char.toUpperCase())}
                    </h2>
                }
                <h2 className="prod-price">
                  Price: ₹ {parseInt(prod.price, 10)}.00
                </h2>
                <h2 className="prod-qtn">Quantity: {prod.quantity}</h2>
                {prod.size === "Medium - (100mm * 44 mm) 12 labels - 36nos" && (
                  <h3 className="prod-sheet">Total Sheets: 3</h3>
                )}
                {prod.size !== "Medium - (100mm * 44 mm) 12 labels - 36nos" && prod.Name !== 'Birthdaycap' && (
                  <h3 className="prod-sheet">Total Sheets: 4</h3>
                )}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <button
                    className="prod-remove"
                    onClick={() => removeProduct(prod, index)}
                  >
                    Remove
                  </button>
                  <button
                    className="prod-edit"
                    onClick={() => {
                      handleEditOrder(prod);
                      if (prod?.productcode?.startsWith("NSHRT")) {
                        navigate(`/NS${prod.template}/${prod.productcode}`);
                      }
                      if (prod?.template?.startsWith("CN")) {
                        navigate(`/${prod.template}/${prod.productcode}`);
                      }
                      if (prod?.Name === "Birthdaycap") {
                        navigate('/Birthdaycap')
                      }
                      removeProduct(prod);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
            <button id="addprod" onClick={handleAddProduct}>
              Add Product
            </button>
          </div>


          {/* <ProductDisplay  orderData={orderData} removeProduct={removeProduct} handleEditOrder={handleEditOrder} handleAddProduct={handleAddProduct}/> */}
          {iserror && (
            <Googleform
              iserror={iserror}
              seterror={seterror}
              invoiceid={orderid}
            />
          )}
          <div id="user-details">
            <div id="options">
              <div id="delivery">
                <div id="delivery-mode">
                  {isReseller && (
                    <div className="floating-user-box">
                      {rescoup?.startsWith("RO") ? "RO User" : "RP User"}
                    </div>
                  )}
                  <h2 className="topic">Delivery Mode</h2>
                  <div className="mode">
                    <label style={{ opacity: isReseller ? "0.7" : "1" }}>
                      <input
                        type="radio"
                        name="delivery"
                        value="normal-delivery"
                        checked={deliveryMode === "normal-delivery"}
                        onChange={handleDeliveryChange}
                        id="normaldelivery"
                        disabled={isReseller ? true : false}
                      />
                      Normal Delivery
                    </label>
                    <label style={{ opacity: isReseller ? "0.7" : "1" }}>
                      <input
                        id="expressdelivery"
                        type="radio"
                        name="delivery"
                        value="express-delivery"
                        checked={deliveryMode === "express-delivery"}
                        onChange={handleDeliveryChange}
                        disabled={isReseller ? true : false}
                      />
                      Express Delivery
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="delivery"
                        value="Self-pick up"
                        checked={deliveryMode === "Self-pick up"}
                        onChange={handleDeliveryChange}
                        id="selfpickup"
                      />
                      Self Pickup
                    </label>
                  </div>
                </div>
                <div id="payment-mode">
                  <h2 className="topic">Payment Mode</h2>
                  <div className="mode">
                    <label>
                      <input
                        type="radio"
                        name="payment"
                        value="online-payment"
                        checked={paymentMode === "online-payment"}
                        onChange={(e) => handlePaymentChange(e.target.value)}

                      />
                      Online Payment
                    </label>
                    <label style={{ opacity: isReseller ? "0.7" : "1" }}>
                      <input
                        type="radio"
                        name="payment"
                        value="partial-payment"
                        checked={paymentMode === "partial-payment"}
                        onChange={(e) => handlePaymentChange(e.target.value)}
                        disabled={isReseller}
                      />
                      Partial Cash On Delivery
                    </label>
                    <label style={{ opacity: isReseller ? "0.7" : "1" }}>
                      <input
                        type="radio"
                        name="payment"
                        value="cashon-payment"
                        checked={paymentMode === "cashon-payment"}
                        onChange={(e) => handlePaymentChange(e.target.value)}
                        disabled={isReseller}
                      />
                      Full Cash On Delivery
                    </label>
                  </div>
                </div>

                <div id="Couponbox">
                  <h2 className="topic">Coupons</h2>
                  <div className="mode">
                    <input
                      type="text"
                      id="coupon"
                      name="coupon"
                      value={couponCode}
                      onChange={handleCouponChange}
                    />
                    <button
                      id="submitcoupon"
                      className={`coupon-button ${isClicked ? "" : "shake"}`}
                      onClick={handleSubmitCoupon}
                    >
                      Get Offer
                    </button>
                    {isReseller && (
                      <div className="coupon-container">
                        <h2>Available Coupons</h2>

                        <h4
                          className={
                            couponCode === "DISCOUNTNSR20" ? "selected" : ""
                          }
                          onClick={() => {
                            setCouponCode("DISCOUNTNSR20");
                            handleSubmitCoupon();
                          }}
                        >
                          DISCOUNTNSR20
                        </h4>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div id="prices1">
                <h3 className="topic">Payment</h3>
                <h3>Product Price:  ₹ {prodPrice}</h3>
                <h3 id="delivery-charge-h3">Delivery Charge:  ₹ {delPrice}</h3>
                <h3 id="cod1">CoD Charge:  ₹ {cod}</h3>
                <h3>Total Payment: ₹ {totalPrice}</h3>

                <h5 id="partial">
                  Pay partial amount via Online Payment and the Balance amount
                  in Cash during Delivery.<s> ₹{totalPrice}</s>  ₹{" "}
                  {Math.round(totalPrice / 2)}
                </h5>
                <h3 id="message"></h3>
                {isVisible && (
                  <div id="selectop">
                    <select
                      name="forselect"
                      id="forselect"
                      onClick={handleSelectOption}
                    >
                      <option value="formyself">For My Self</option>
                      <option value="forcustomer">For Customer</option>
                    </select>
                  </div>
                )}
                {visiblerp && (
                  // <div id= "selectop1">
                  //   <select name="forselect1" id="forselect1" value={selectedvalue} onChange={handleSelectOption}>
                  //       <option value="normal">Normal</option>
                  //       <option value="instant">Instant</option>
                  //     </select>
                  // </div>
                  <div className="toggle-container">
                    <span className="toggle-label">Normal</span>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={selectedvalue === "instant"}
                        onChange={() =>
                          handleSelectOption({
                            target: {
                              value:
                                selectedvalue === "normal"
                                  ? "instant"
                                  : "normal",
                            },
                          })
                        }
                      />
                      <span className="slider"></span>
                    </label>
                    <span className="toggle-label">Instant</span>
                  </div>
                )}
                {offer &&
                  <h3 className="offer-banner">
                    🚚🎉 Free Shipping for Chennai People till Weekend Periods only! 🛍️✨
                    pincode Between 600001-600117
                  </h3>
                }      </div>
            </div>

            <div id="form-container">
              <h2 className="topic">Delivery Details</h2>
              <form
                id="address-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;

                  const name = form.name.value.trim();
                  const phone = form.phone.value.trim();
                  const address1 =
                    localStorage.getItem("address1") ||
                    form.address1.value.trim();
                  const pincode = form.pincode.value.trim();

                  let phoneNumber = phone.trim();
                  let cleanedPhone = phoneNumber.replace(/\D/g, "");
                  // Ensure the main number (excluding country code) has exactly 10 digits
                  if (cleanedPhone.length < 10 || cleanedPhone.length > 13) {
                    alert("Please enter a valid phone number with a country code or exactly 10 digits!");
                    return;
                  }
                  // If it has a country code, ensure the main number is still 10 digits
                  let mainNumber = cleanedPhone.length > 10 ? cleanedPhone.slice(-10) : cleanedPhone;
                  if (mainNumber.length !== 10) {
                    alert("Please enter a valid 10-digit phone number!");
                    return;
                  }
                  const reseller = localStorage.getItem("ResellerLogin") || false;
                  if (!couponCode && !reseller) {
                    if (pincode.length !== 6 || !/^\d+$/.test(pincode)) {
                      alert("Please enter a valid 6-digit pincode!");
                      return;
                    }
                    if (!name || !phone || !address1) {
                      alert("Please fill in all required fields!");
                      return;
                    }
                  }

                  if (orderData.length === 0) {
                    alert("Select atleast One Product!!!");
                    return;
                  }
                  handleProceedToPayment();
                }}
              >
                <label htmlFor="name">
                  Name: <span className="astrics">*</span>
                </label>
                <input type="text" id="name" name="name" required defaultValue={fc.name || ""} />

                <label htmlFor="email">
                  Email:
                </label>
                <input type="email" id="email" name="email" defaultValue={fc.email || ""} />

                <label htmlFor="phone">
                  Phone Number: <span className="astrics">*</span>
                </label>

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  maxLength="15"
                  required
                  defaultValue={fc.phone || ""}
                  onChange={(e) => { setwhatsapp(e.target.value) }}
                />
                <div
                  id="resellerdisplay"
                  style={{ display: isReseller ? "none" : "block" }}
                >
                  <label htmlFor="whatsappno">
                    Whatsapp Number: <span className="astrics"></span>
                  </label>
                  <input
                    type="tel"
                    id="whatsappno"
                    name="whatsappno"
                    maxLength="10"
                    defaultValue={whatsapp || fc.whatsappno}
                  />
                  <label htmlFor="address1">
                    Address Line 1: <span className="astrics">*</span>
                  </label>
                  <input type="text" id="address1" name="address1" defaultValue={fc.address1 || ""} />
                  <label htmlFor="address2">
                    Address Line 2: <span className="astrics"></span>
                  </label>
                  <input type="text" id="address2" name="address2" defaultValue={fc.address2 || ""} />
                  <label htmlFor="pincode">
                    Pincode: <span className="astrics">*</span>
                  </label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    maxLength="6"
                    onChange={(e) => fetchLocation(e.target.value)}
                    defaultValue={fc.pincode || ""}
                  />

                  <label htmlFor="district">
                    District <span className="astrics">*</span>
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    readOnly
                    required
                    defaultValue={fc.district || ""}
                  />
                  <label htmlFor="state">
                    State <span className="astrics">*</span>
                  </label>
                  <input type="text" id="state" name="state" readOnly defaultValue={fc.state || ""} />

                  <label htmlFor="landmark">Landmark</label>
                  <input type="text" id="landmark" name="landmark" defaultValue={fc.landmark || ""} />
                </div>
                <button id="proceedtopay" type="submit">
                  {paymentMode === "cashon-payment"
                    ? "Proceed To Order"
                    : influencer
                      ? "Proceed to Order"
                      : "Proceed To Payment"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;