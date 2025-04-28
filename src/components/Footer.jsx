import React from 'react';
import logo from '/logo.webp';
import "../style.css";
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './footermobile.css'
function Footer() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <>
      {!isMobile &&
        <>
          <footer className="section-p1">
            <div className="col1">
              <a href="#" className="logo-section">
                <img src={logo} alt="logo" className="logo" />
                <h2>DreamikAI</h2>
              </a>

              <div className="contact-info">
                <p><strong>Address:</strong>
                  MURVEN Infotech Design Solutions LLP,
                  715-A, 7th Floor, Spencer Plaza,
                  Suite No.548, Mount Road, Anna Salai,
                  Chennai-600 002, Tamil Nadu, India.
                </p>
                <p><strong>General Inquiries:</strong> +91-44-28505188</p>
                <span><strong>Email:</strong>
                  <a data-auto-recognition="true" href="dreamikai@gmail.com" className="wixui-rich-text__text" >dreamikai@gmail.com</a>
                </span>
                <br />
                <span><strong>Whatsapp:</strong>

                  <a href="https://wa.me/+919498088659" target="_blank" >+919498088659</a>
                </span>
                <p><strong>GST:</strong> 33ABPFM6846A1Z8</p>
              </div>
            </div>
            <div className="col2">
              <h3>Menu</h3>
              <a href="#">Dreamik AI</a>
              <a href="#" onClick={() => navigate('/adminpanel')}>Admin Panel</a>
              <a href="privacy.html">Privacy Policy</a>
              <a href="#" onClick={() => navigate('/termsandcondition')}>Terms & Conditions</a>
              <a href="refund.html">Return and Refund</a>
              <a href="#"><i className="fa-solid fa-phone"></i> Contact Us</a>
            </div>
            <div className="col3">
              <h3>My Account</h3>
              <a href="#">Sign In</a>
              <a href="#" onClick={() => navigate('/Order')}>View Cart</a>
              <a href="#">My Wishlist</a>
              <a href="#" onClick={() => navigate('/myorder')}>Track My Order</a>
              <a href="#" onClick={() => navigate('/pendingorders')}>Pending Orders</a>
              <a href='#' onClick={() => navigate("/location")}>Reseller details</a>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSfqSptm0r-Wk9ZjjD5cvVnaHBwzmiK7rspoRSzZZm9BBpNU5A/viewform?vc=0&c=0&w=1&flr=0&fbclid=IwY2xjawH_SlxleHRuA2FlbQIxMAABHQFNyKZWhvQsA0W1JO3uZf1dcj6BgDB_D7-IneEcl4fVvU36vWhsccyv0Q_aem_5gfWG7arUmsGCt6jIGSlmA">Reseller Request</a>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLSemg6VNtaJAAbcxAqCs7U8w5pBkv5-QgHSi1SNf-9dC7z_ueA/viewform?vc=0&c=0&w=1&flr=0&usp=mail_form_link">Help</a>
              <a href="https://docs.google.com/forms/d/e/1FAIpQLScO4MlvWy3ZuLNy1e_aifz7EP-Lfypva2nc6mgzOTVFLnGHlw/viewform?vc=0&c=0&w=1&flr=0">Feedback</a>
            </div>
            <div className="follow">
              <h3>Follow us</h3>
              <div className="icons">
                <a href="https://www.facebook.com/dreamikai"><i className="fab fa-facebook"></i></a>
                <a href="https://twitter.com/dreamikaicomics"><i className="fab fa-twitter"></i></a>
                <a href="https://www.instagram.com/dreamik.ai/"><i className="fab fa-instagram"></i></a>
                <a href="https://www.youtube.com/channel/UC4B8UinlrPeW4yY0yPc37Tg"><i className="fab fa-youtube"></i></a>
              </div>
            </div>
            <div className="col-install">
              <h3>Install</h3>
              <div className="icons">
                <a href="https://play.google.com/store/apps/details?id=com.murvenllp.dreamikaicomics"><i className="fab fa-google-play"></i></a>
              </div>
            </div>
            <div className="col-payment">
              <h3>Secured Payment Gateways</h3>
              <div className="icons">
                <a href=""><i className="fab fa-cc-visa"></i></a>
                <a href=""><i className="fab fa-cc-mastercard"></i></a>
                <a href=""><i className="fab fa-google-pay"></i></a>
              </div>
            </div>
          </footer>
          <footer className="f-2">
            <p>© 2024 by Dreamik AI. Created by Sanads Digital</p>
            <p>Version: 1.1.2</p>
          </footer>
        </>
      }
      {isMobile &&
        <div id='whole2'>
          <div className='footer-1'>
            <div className='footer11'>
              <img src="/mediaquery/str.png" alt="" />
              <h2>Join The Club !</h2>
              <img src="/mediaquery/arrow.png" alt="" />
            </div>
            <div className='footer11'>
              <h4>Get <span style={{ color: '#ffae00' }}>E-mail</span> updates about our latest shop and special offers! </h4>
            </div>
            <div className='footer12'>
              <input type="text" placeholder='Enter Email ID' />
              <button type='submit'>SUBMIT</button>
            </div>
          </div>
          <hr className='hr' />
          <div className='footer-2'>

            <div>
              <img src="/mediaquery/batch.png" alt="" />
              <h4>PREMIUM QUALITY ASSURED</h4>
            </div>
            <hr />
            <div>
              <img src="/mediaquery/timer.png" alt="" />
              <h4>EXPRESS DELIVERY</h4>
            </div>
            <hr />
            <div>
              <img src="/mediaquery/best-support.png" alt="" />
              <h4>BEST SUPPORT</h4>
            </div>

          </div>
          <hr className='hr' />
          <div className='footer-3'>
            <h5>FOLLOW US</h5>
            <div className='footer31'>
              <img src="/mediaquery/insta.png" alt="" />
              <img src="/mediaquery/facebk.png" alt="" />
              <img src="/mediaquery/utube.png" alt="" />
            </div >
            <h5>SUPPORT</h5>
            <div className='footer32'>
              <h3>
                <img src="/mediaquery/phone.png" alt="" /><a href="tel:+91-44-28505188" style={{ color: "whitesmoke" }}>+91-44-28505188</a>
              </h3>
              <h3>
                <img src="/mediaquery/mail.png" alt="" /> <a href="mailto:dreamikai@gmail.com" style={{ color: "whitesmoke" }}>dreamikai@gmail.com</a>
              </h3>
              <h3>
                <i className="fab fa-whatsapp" style={{ fontSize: "24px" }}></i><a href="https://wa.me/+919498088659" target="_blank" style={{ color: "whitesmoke" }}>+919498088659</a>

              </h3>
            </div>
            <div className='footer33'>
              <h5>100% SECURE PAYMENTS</h5>
              <div className='footer34'>
                <img src="/mediaquery/pal.png" alt="" />
                <img src="/mediaquery/double.png" alt="" />
                <img src="/mediaquery/gpay.png" alt="" />
                <img src="/mediaquery/paytm.png" alt="" />
                <img src="/mediaquery/visa.png" alt="" />
              </div>
            </div>
          </div>

          <div className='footer-4'>
            <div className='footer41'>
              <div className='footer43'>
                <img src="/mediaquery/logo.png" alt="" />
                <h1>
                  DreamikAI.</h1>
              </div>
              <div style={{ display: "flex" }}>
                <img src="/mediaquery/lctn.png" alt="" style={{ width: "20px", height: "20px" }} />
                <h4>MURVRN Infotech Design Solutions
                  LLP,715-A,7th Floor,Spencer Plaza,
                  Suite No.548,Mount Road,Anna
                  Salai,Chennai-600 002,Tamil
                  Nadu,India</h4>
              </div>
            </div>
            <div className='footer42'>
              <div>
                <div className='column1'>
                  <h1>Company</h1>
                  <a href="#">Dreamik AI</a>
                  <a href="#" onClick={() => navigate('/adminpanel')}>Admin Panel</a>
                  <a href="privacy.html">Privacy Policy</a>
                  <a href="#" onClick={() => navigate('/termsandcondition')}>Terms & Conditions</a>
                  <a href="refund.html">Return and Refund</a>
                  <a href="#"><i className="fa-solid fa-phone"></i> Contact Us</a>

                </div>
              </div>
              <div>
                <div className="column2">
                  <h3 style={{ marginBottom: "10px" }}>My Account</h3>
                  <a href="#">Sign In</a>
                  <a href="#" onClick={() => navigate('/Order')}>View Cart</a>
                  <a href="#">My Wishlist</a>
                  <a href="#" onClick={() => navigate('/myorder')}>Track My Order</a>
                  <a href="#" onClick={() => navigate('/pendingorders')}>Pending Orders</a>
                  <a href='#' onClick={() => navigate("/location")}>Reseller details</a>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLSfqSptm0r-Wk9ZjjD5cvVnaHBwzmiK7rspoRSzZZm9BBpNU5A/viewform?vc=0&c=0&w=1&flr=0&fbclid=IwY2xjawH_SlxleHRuA2FlbQIxMAABHQFNyKZWhvQsA0W1JO3uZf1dcj6BgDB_D7-IneEcl4fVvU36vWhsccyv0Q_aem_5gfWG7arUmsGCt6jIGSlmA">Reseller Request</a>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLSemg6VNtaJAAbcxAqCs7U8w5pBkv5-QgHSi1SNf-9dC7z_ueA/viewform?vc=0&c=0&w=1&flr=0&usp=mail_form_link">Help</a>
                  <a href="https://docs.google.com/forms/d/e/1FAIpQLScO4MlvWy3ZuLNy1e_aifz7EP-Lfypva2nc6mgzOTVFLnGHlw/viewform?vc=0&c=0&w=1&flr=0">Feedback</a>
                </div>
              </div>
            </div>
          </div>
        </div>

      }
    </>
  );
}

export default Footer;