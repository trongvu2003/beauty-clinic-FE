import { FaPhoneAlt, FaFacebookMessenger } from "react-icons/fa";
import "./FloatingContact.css";

const FloatingContact = () => {
  const phoneNumber = "0901234567";
  const zaloNumber = "0901234567";
  const messengerId = "ktbeautymedical";

  return (
    <div className="floating-contact">
      <a
        href={`tel:${phoneNumber}`}
        className="contact-icon icon-call"
        aria-label="Gọi điện thoại"
      >
        <FaPhoneAlt size={22} />
      </a>
      <a
        href={`https://zalo.me/${zaloNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-icon icon-zalo"
        aria-label="Chat Zalo"
      >
        Zalo
      </a>
      <a
        href={`https://m.me/${messengerId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="contact-icon icon-mess"
        aria-label="Chat Messenger"
      >
        <FaFacebookMessenger size={26} />
      </a>
    </div>
  );
};

export default FloatingContact;
