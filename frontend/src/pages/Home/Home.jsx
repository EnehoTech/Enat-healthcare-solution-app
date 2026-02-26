
import Blogs from "../../components/Blogs/Blogs";
import HeroSection from "../../components/HeroSection/HeroSection";
import AboutUs from "../../components/AboutUs/AboutUs";
import HotLineSection from "../../components/HotLineSection/HotLineSection";
import ServiceSection from "../../components/ServiceSection/ServiceSection";
import ContactAddress from "../../components/ContactAddress/ContactAddress";
import Faq from "../../components/Faq/Faq";
import Testimonials from "../../components/Testimonials/Testimonials";
import Department from "../../components/Department/Department";

const Home = () => {
  return (
    <>
      <HeroSection />
      <AboutUs />
      <HotLineSection />
      <ServiceSection />
      <Department />
      <Testimonials />
      <Blogs  />
      <Faq />
      <ContactAddress />
    </>
  );
};

export default Home;
