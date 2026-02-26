import { useEffect, useState } from "react";
import Slider from "react-slick";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import styles from "./Testimonials.module.css";
import TestimonialsItem from "./TestimonialsItem/TestimonialsItem";
import SectionTitle from "../SectionTitle/SectionTitle";
import { getAllTestimonialsService } from "../../services/public.service";
import handleError from "../../utils/handleError";
import Alert from "../../shared/components/Alert/Alert";

// custom go to previous btn
const GoToPreviousBtn = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <HiArrowNarrowLeft className="go-prev-icon" />
    </div>
  );
};
// custom go to next btn
const GoToNextBtn = (props) => {
  const { className, onClick } = props;
  return (
    <div className={className} onClick={onClick}>
      <HiArrowNarrowRight className="go-next-icon" />
    </div>
  );
};

const Testimonials = () => {
  const [testimonialsData, setTestimonialsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiErrors, setApiErrors] = useState(null);


  // Fetch all testimonials
  useEffect(() => {
    fetchAllTestimonials();
  }, []);

  const fetchAllTestimonials = async () => {
    try {
      setIsLoading(true);
      setApiErrors(null);
      const response = await getAllTestimonialsService();
      if (response.success === true) {
        setTestimonialsData(response.data.testimonials || []);
      }
    } catch (error) {
      setApiErrors(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };



  const settings = {
    dots: true,
    infinite: true,
    lazyLoad: true,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    prevArrow: <GoToPreviousBtn />,
    nextArrow: <GoToNextBtn />,
    initialSlide: 0,
  };

  return (
    <>
      {testimonialsData.length > 0 && (
        <section
          className={`p-block-70 ${styles["testimonials-section"]} testimonials-section`}
        >
          <div className={`container  px-3 ${styles["fixed-container"]}`}>
            {/* ======= section title start =======  */}
            <SectionTitle
              title="Testimonials"
              description="Praises for the Enat Health Care Solution's efforts."
            />
            {/* ======= section title end =======  */}
            {apiErrors && (
              <Alert
                message={apiErrors}
                alertBg="bg-red-25"
                alertClass="alert-danger"
                messageColor="text-danger"
              />
            )}

            {isLoading ? (
              <PreLoader />
            ) : (
              <Slider {...settings}>
                {testimonialsData?.map((testimonialItem, idx) => (
                  <div key={`testimonials-${idx}`}>
                    <TestimonialsItem
                      testimonialText={testimonialItem?.testimonial_text}
                      testifierAvatar={testimonialItem?.testifier_avatar}
                      fullName={testimonialItem?.full_name}
                      jobTitle={testimonialItem?.job_title}
                      bgColor={testimonialItem?.bg_color}
                    />
                  </div>
                ))}
              </Slider>
            )}
          </div>
        </section>
      )}
    </>
  );
};

export default Testimonials;
