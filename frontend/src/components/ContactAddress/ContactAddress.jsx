import { PiMapPinAreaBold } from "react-icons/pi";
import { FaPhoneVolume } from "react-icons/fa6";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoMdClock } from "react-icons/io";
import styles from "./ContactAddress.module.css";

const ContactAddress = () => {
  // Array containing contact information data
  const contactAddressData = [
    {
      icon: <PiMapPinAreaBold size={30} />,
      title: "Address",
      content: ["Addis Ababa, Ethiopia", "Bole friendship"],
      link: null, // No link for address
    },
    {
      icon: <FaPhoneVolume size={30} />,
      title: "Phone",
      content: ["Phone: +251911234567"],
      // Each contact corresponds to a phone link
    },
    {
      icon: <MdOutlineMailOutline size={30} />,
      title: "Email",
      content: ["support@enatHealthcare.com", "enatHealthcare@gmail.com"],
      link: [
        "mailto:support@enatHealthcare.com",
        "mailto:enatHealthcare@gmail.com",
      ], // Each email has a mailto link
    },
    {
      icon: <IoMdClock size={30} />,
      title: "Working Hours",
      content: ["Sunday - Saturday", "9:00AM - 5:00PM"],
      link: null, // No link for working hours
    },
  ];

  return (
    <div className={`${styles["contact-address-section"]} p-block-70`}>
      <div className="container">
        <div className="row">
          {/* Map through the contactAddressData to display each item */}
          {contactAddressData?.map((contactAddress, i) => (
            <div className="col-lg-3 col-sm-6 col-md-6 mb-4 mb-lg-0" key={i}>
              <div
                className={`${styles["single-contact-address-box"]} text-center`}
              >
                {/* Display the icon */}
                <div className={`${styles["icon"]}`}>{contactAddress.icon}</div>
                <h3>{contactAddress.title}</h3>

                {/* Map through the content array to display each contact info */}
                {contactAddress.content.map((item, index) => (
                  <p key={index}>
                    {/* If a link exists for the current content item, render it as a clickable link */}
                    {contactAddress.link && contactAddress.link[index] ? (
                      <a
                        href={contactAddress.link[index]}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {item}
                      </a>
                    ) : (
                      // Otherwise, render it as plain text
                      item
                    )}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContactAddress;
