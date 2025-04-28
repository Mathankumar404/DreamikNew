import { FileX } from "lucide-react";

const Googleform = ({ iserror, seterror, invoiceid }) => {
  // const orderId="jbdjkfdkdf"
  const email = "dreamikai@gmail.com";
  const subject = `Order Inquiry - ${invoiceid}`;
  const body = `Hello,\n\nI have an issue with my order (invoiceid: ${invoiceid}). Please assist.\n\nThank you.`;
  const phoneNumber = "+919498088659"; // Replace with actual number
  const whatsappMessage = `Hello, I have an issue with my order (invoiceid: ${invoiceid}). Please assist.`;
  //  console.log(orderid,"inv",invoiceid)
  return (
    <div >
      {iserror && (
        <>
          <div className="error-overlay" onClick={() => seterror(null)}></div>
          <div className="error-popup">
            <button className="error-close" onClick={() => seterror(null)}>✖</button>
            <h3>⚠️ Oops! Something went wrong</h3>
            <p>{iserror}</p>
            <p>💡 Having any issues? Let us know!</p>
            <a href="https://docs.google.com/forms/d/e/1FAIpQLSemg6VNtaJAAbcxAqCs7U8w5pBkv5-QgHSi1SNf-9dC7z_ueA/viewform?vc=0&c=0&w=1&flr=0&usp=mail_form_link" target="_blank" rel="noopener noreferrer">
              <button className="error-button">Fill the Google form </button>
            </a>
            <br />
            OR <br />
            {invoiceid &&
              (
                <div>
                  <h5> Contact us with <br /> invoiceid: `{invoiceid}`</h5> <br />
                  <h3> Whatsapp:<a href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`} target="_blank" rel="noopener noreferrer">
                    {phoneNumber}
                  </a></h3>
                  <br />
                  <h4 style={{ margin: "0 -6% 3% " }}> Email:
                    <a href={`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`}>
                      {email}
                    </a>
                  </h4>
                </div>
              )
            }
            {/* <a href="tel:us:+91-44-28505188" className="call-button">📞 Contact Us:+91-44-28505188</a> */}
          </div>
        </>
      )}
    </div>
  )
};

export default Googleform;