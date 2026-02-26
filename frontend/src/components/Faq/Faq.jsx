import { useEffect, useState } from "react";
import { getAllFaqsService } from "../../services/public.service";
import SectionTitle from "../SectionTitle/SectionTitle";
import styles from "./Faq.module.css";
import handleError from "../../utils/handleError";
import Alert from "../../shared/components/Alert/Alert";
import PreLoader from "../../shared/components/PreLoader/PreLoader";
const Faq = () => {
  const [faqsData, setFaqsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);
  // State that hold faqs displayed
  const [displayedFaqsCount, setDisplayedFaqsCount] = useState(9);

  // Fetch all faqs
  useEffect(() => {
    fetchAllFaqs();
  }, []);

  const fetchAllFaqs = async () => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      const response = await getAllFaqsService();
      if (response.success === true) {
        setFaqsData(response.data.faqs || []);
      }
    } catch (error) {
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  //   handle Show More
  const handleShowMore = () => {
    setDisplayedFaqsCount(faqsData.length); // Show all faqs
  };
  //   handle Show Less
  const handleShowLess = () => {
    setDisplayedFaqsCount(9); // Reset to showing only 9 faqs
  };
  return (
    <div className={` ${styles["faq-section"]}`}>
      <div className="container">
        {/* ======= section title start =======  */}
        <SectionTitle title="FAQ's" description="Frequently Asked Questions." />
        {/* ======= section title end =======  */}

        {isLoading ? (
          <PreLoader />
        ) : (
          faqsData.length > 0 && (
            <section id="faqs" className="ptb-100">
              <div className="container">
                {apiErrors && (
                  <Alert
                    message={apiErrors}
                    alertBg="bg-red-25"
                    alertClass="alert-danger"
                    messageColor="text-danger"
                  />
                )}
                <div
                  className={`${styles["faq-accordion"]} accordion`}
                  id="faqAccordion"
                >
                  {faqsData?.slice(0, displayedFaqsCount)?.map((faqItem, i) => (
                    <div
                      className={`${styles["accordion-item"]} accordion-item`}
                      key={i}
                    >
                      <button
                        className={`${styles["accordion-button"]} accordion-header accordion-button `}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#collapse-${i}`}
                        aria-expanded="false"
                        aria-controls={`collapse-${i}`}
                      >
                        {faqItem.faq_question}
                      </button>
                      <div
                        id={`collapse-${i}`}
                        className={` ${styles["accordion-collapse"]} accordion-collapse collapse`}
                        data-bs-parent="#faqAccordion"
                      >
                        <div
                          className={` ${styles["accordion-body"]} accordion-body`}
                        >
                          <p>{faqItem.faq_answer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4 mb-1">
                  {faqsData.length > 9 && (
                    <>
                      {displayedFaqsCount < faqsData?.length ? (
                        <button className="main-btn" onClick={handleShowMore}>
                          Show More FAQ's
                        </button>
                      ) : (
                        <button className="main-btn" onClick={handleShowLess}>
                          Show Less FAQ's
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </section>
          )
        )}
      </div>
    </div>
  );
};

export default Faq;
