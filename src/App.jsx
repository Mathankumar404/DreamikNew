import React, { useState, useEffect, lazy, Suspense, useRef } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./index.css";
import "./style.css";
import Navbar from "./components/Nav";
import Footer from "./components/Footer";
import Newsletter from "./components/Newsletter";
import Advertisement from "./components/Advertisement";

import ProductDetails from "./components/cutoutnameslip/ProductDetails";



import Products from "./components/nameslip/Products";
import NStemplate2 from "./components/nameslip/NStemplate2";


import NStemplate3 from "./components/nameslip/NStemplate3";
import NStemplate4 from "./components/nameslip/NStemplate4";
import NStemplate5 from "./components/nameslip/NStemplate5";
import NStemplate6 from "./components/nameslip/NStemplate6";
import NStemplate7 from "./components/nameslip/NStemplate7";
import NStemplate1 from "./components/nameslip/NStemplate1";
import NStemplate8 from "./components/nameslip/NStemplate8";
import NStemplate9 from "./components/nameslip/NStemplate9";
import NStemplate10 from "./components/nameslip/NStemplate10";
import NStemplate11 from "./components/nameslip/NStemplate11";
import NStemplate12 from "./components/nameslip/NStemplate12";

import logo from "/logo.webp";
import CustomNameSlips from "./components/customnameslip/CustomNameSlips";

import ScrollToTop from "./components/ScrollTop";


import CNTemplate1 from "./components/cutoutnameslip/CNtemplate1";
import demoVideo from "/videos/demo video dreamik.mp4";
import customizevideo from "/videos/customizevideo.mp4";

import ProductList from "./components/ProductList";
import { Helmet, HelmetProvider } from 'react-helmet-async';

import Payment from "./components/payment/Payment";
import OrderConfirmation from "./components/orderconfirmation/OrderConfirmation";

const Myorder = lazy(() => import("./components/Myorder"));
const Laserprinter = lazy(() => import("./components/Laserprinter"));
const Fullcashondelivery = lazy(() => import("./components/Fullcashondelivery"));
const Splashimage = lazy(() => import("./components/Splashimage"));
const Order = lazy(() => import("./components/order/Order"));
const CustamizableBagTage = lazy(() => import("./components/bagtag/CustamizableBagTage"));
const PendingOrders = lazy(() => import("./components/PendingOrders"));
const CutoutNameslip = lazy(() => import("./components/cutoutnameslip/CutoutNameslip"));
const Nameslips = lazy(() => import("./components/nameslip/NameSlips"));
const Adminpanel = lazy(() => import("./components/adminpanel/Adminpanel"));
const AdminCouponTable = lazy(() => import("./components/adminpanel/AdminCouponTable"));
const Terms = lazy(() => import("./Terms"));
const BackgroundRemover = lazy(() => import("./components/backgroundremover/BackgroundRemover"));
const AiNameslipGen = lazy(() => import("./components/AiNameslipGen"));
const Location = lazy(() => import("./components/Location/location"));
const SplashScreen = lazy(() => import("./components/order/Splashscreen"));
const BulkPrinting = lazy(() => import("./components/BulkPrinting"));
const BulkOrder = lazy(() => import("./components/bulkorder/BulkOrder"));
const PageLogger = lazy(() => import("./components/pagelogger"));
const Birthdaycap = lazy(() => import("./components/birthdaycapfolder/Birthdaycap"));
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function AppContent() {
  const [isVisible, setIsVisible] = useState(true);
  const [isVisibleht, setIsVisibleht] = useState(true);
  const [orderData, setOrderData] = useState([]);
  const [isVisiblecustomize, setIsVisiblecustomize] = useState(false);
  const [isvisiblecutout, setisvisiblecutout] = useState(true);
  const [ResellerLogin, setResellerLogin] = useState(false);
  const [ResellerProducts, setResellerProducts] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [showSplash, setShowSplash] = useState(false);
  const [coupon, setcoupon] = useState("");

  const location = useLocation(); // This now works since it's inside Router
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer = setTimeout(
      () => {
        setIsLoading(false);
      },
      location.pathname === "/" ? 2000 : 1000
    );

    return () => clearTimeout(timer); // Clears the previous timeout before setting a new one
  }, [location.pathname]);

  useEffect(() => {
    if (!sessionStorage.getItem("functionExecuted")) {
      sessionStorage.setItem("functionExecuted", true);
      // setShowSplash(true);
      setVisible(true)
    }
   
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light-mode-only");
    
  }, []);

  useEffect(() => {
    const rl = localStorage.getItem("ResellerLogin") || false;
    setResellerLogin(rl);
    const resp = localStorage.getItem("ResellerProducts") || "";
    setResellerProducts(resp);
  }, []);

  const handleVideoClick = () => {
    setIsVisible(true);
    setIsVisibleht(true);
    setisvisiblecutout(true);
    setShowSplash(true);
  };

  const handleEditOrder = (prod) => {
    localStorage.setItem("editedproduct", JSON.stringify(prod));
  };

  const handlecustomizeVideoClick = () => {
    setShowSplash(true);
    setIsVisiblecustomize(true);
    setIsVisible(false);
  };


  return (
    <HelmetProvider>
      <>
        <Helmet>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />

          <title>DreamikAI - Best AI Shop for Smart Products</title>
          <meta name="description" content="Buy AI-powered products at DreamikAI. Get the latest AI gadgets, tools, and accessories." />
          <meta name="keywords" content="AI shop, AI gadgets, artificial intelligence tools, smart devices" />
          <meta name="author" content="DreamikAI" />
          <meta name="robots" content="index, follow" />

          {/* Open Graph (Facebook, LinkedIn) */}
          <meta property="og:title" content="DreamikAI - Best AI Shop for Smart Products" />
          <meta property="og:description" content="Explore a range of AI-powered products, smart tools, and gadgets at DreamikAI." />
          <meta property="og:image" content="https://dreamik.com/splashscreenImages/splashscreenimage.webp" />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:type" content="website" />

          {/* Twitter Card */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="DreamikAI - AI-Powered Products" />
          <meta name="twitter:description" content="Buy AI-powered gadgets and smart devices online at DreamikAI." />
          <meta name="twitter:image" content="https://dreamik.com/splashscreenImages/splashscreenimage.webp" />
        </Helmet>
        {isLoading ? (
          <div className="loading-screen">
            <img src={logo} alt="Loading..." className="loading-logo" />
          </div>
        ) : (
          <>
            <Suspense fallback={<div></div>}>
              <Splashimage visible={visible} setVisible={setVisible} />
              <PageLogger />
              <Navbar
                searchText={searchText}
                setSearchText={setSearchText}
                resellerLogin={ResellerLogin}
                setResellerLogin={setResellerLogin}
                setResellerProducts={setResellerProducts}
              />

              <Advertisement />

              <Routes>
                <Route
                  path="/"
                  element={
                    <ProductList
                      searchText={searchText}
                      resellerlogin={ResellerLogin}
                      ResellerProducts={ResellerProducts}
                    />
                  }
                />
                <Route
                  path="/CutoutNameslips"
                  element={
                    <CutoutNameslip searchText={searchText} setcoupon={setcoupon} />
                  }
                />
                <Route path="/ProductDetails/:id" element={<ProductDetails />} />
                <Route
                  path="/Nameslips"
                  element={
                    <Nameslips
                      searchText={searchText}
                      setSearchText={setSearchText}
                      setcoupon={setcoupon}
                    />
                  }
                />
                <Route path="/Products/:productcode" element={<Products />} />
                <Route
                  path="/CustamizableBagTage"
                  element={<CustamizableBagTage />}
                />
                <Route
                  path="/Order"
                  element={
                    <Order
                      handleEditOrder={handleEditOrder}
                      orderData={orderData}
                      setOrderData={setOrderData}
                      coupon={coupon}
                    />
                  }
                />
                <Route path="/bulkorder" element={<BulkOrder />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/orderconfirmation" element={<OrderConfirmation />} />
                <Route path="/pendingorders" element={<PendingOrders />} />
                <Route path="/customnameslips" element={<CustomNameSlips />} />
                <Route
                  path="/fullcashondelivery"
                  element={<Fullcashondelivery />}
                />
                <Route path="/myorder" element={<Myorder />} />
                <Route path="/location" element={<Location />} />
                <Route path="/adminpanel" element={<Adminpanel />} />
                <Route path="/termsandcondition" element={<Terms />} />
                <Route path="/NStemplate1/:id" element={<NStemplate1 />} />
                <Route path="/NStemplate2/:id" element={<NStemplate2 />} />
                <Route path="/NStemplate3/:id" element={<NStemplate3 />} />
                <Route path="/NStemplate4/:id" element={<NStemplate4 />} />
                <Route path="/NStemplate5/:id" element={<NStemplate5 />} />
                <Route path="/NStemplate6/:id" element={<NStemplate6 />} />
                <Route path="/NStemplate7/:id" element={<NStemplate7 />} />
                <Route path="NStemplate8/:id" element={<NStemplate8 />} />
                <Route path="NStemplate9/:id" element={<NStemplate9 />} />
                <Route path="NStemplate10/:id" element={<NStemplate10 />} />
                <Route path="NStemplate11/:id" element={<NStemplate11 />} />
                <Route path="NStemplate12/:id" element={<NStemplate12 />} />
                <Route path="CNtemplate1/:id" element={<CNTemplate1 />} />

                <Route path="Bulkprintingsoftware" element={<BulkPrinting />} />
                <Route
                  path="DreamikGlossyInkjet/LaserStickerPaperprinter(6x2)"
                  element={<Laserprinter />}
                />
                <Route path="/admincoupontable" element={<AdminCouponTable />} />
                <Route
                  path="/AITextBehindImage(Free)"
                  element={<AiNameslipGen />}
                />
                <Route path="/BirthdayCap" element={<Birthdaycap />} />

                <Route path="/AIKickoutBackground(Free)" element={<BackgroundRemover />} />
              </Routes>
              {/* <CustomResizable/> */}
              {showSplash && (
                <SplashScreen
                  onClose={() => setShowSplash(true)}
                  isVisible={isVisible}
                  setIsVisible={setIsVisible}
                  isVisiblecustomize={isVisiblecustomize}
                  setIsVisiblecustomize={setIsVisiblecustomize}
                  isvisiblecutout={isvisiblecutout}
                  setisvisiblecutout={setisvisiblecutout}
                />
              )}

              <div id="demovideos">
                <div className="video-thumbnail" onClick={handleVideoClick}>
                  <video
                    className="thumbnail-video"
                    width="300"
                    height="200"
                    preload="none"
                    loading="lazy"
                    poster="/videos/customize-thumbnail.png"
                  >
                    <source src={demoVideo} type="video/mp4" />
                  </video>
                  <div className="overlay-text">Click Demo Video for order</div>
                </div>

                <div
                  className="video-thumbnail"
                  onClick={handlecustomizeVideoClick}
                >
                  <video
                    className="thumbnail-video"
                    width="300"
                    height="200"
                    preload="none"
                    loading="lazy"
                    poster="/videos/customize-thumbnail.png"
                  >
                    <source src={customizevideo} type="video/mp4" />
                  </video>
                  <div className="overlay-text">Click to Demo customize Video </div>
                </div>
              </div>

              <Newsletter />
              <Footer />
            </Suspense>
          </>

        )}
      </>
    </HelmetProvider>
  );
}

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-center"
        autoClose={10000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;