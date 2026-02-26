import { images } from "../../constants/AssetsContainer";
import SectionTitle from "../SectionTitle/SectionTitle";

const AboutUs = () => {
  return (
    //  ======= about us section start =======
    <section id="about" className="about-us-section p-block-70">
      {/* ======= section title start =======  */}
      <SectionTitle
        title="About Us"
        description="Nurturing Health with a Heartfelt Commitment."
      />
      {/* ======= section title end ======= */}

      {/* ======= about us main section =======  */}
      <section className="about-us-container container">
        <section className="row g-4">
          <section className="col-12 col-lg-6">
            <section className="about-us-image">
              <img src={images.aboutUs} alt="about-us-image" />
            </section>
          </section>
          <section className="col-12 col-lg-6">
            <section className="about-us-content">
              <h3>
                Dedicated to providing exceptional healthcare services and
                support.
              </h3>
              <p>
                At Enat Health Care Solutions, we prioritize compassion and
                quality in every interaction. Our mission is to deliver holistic
                care tailored to the unique needs of our patients.
              </p>
              <ul>
                <li>
                  <i className="fa-solid fa-check-double"></i>
                  <span>
                    <strong>Comprehensive Services: </strong>We offer a wide
                    range of medical services to cater to diverse health needs.
                  </span>
                </li>
                <li>
                  <i className="fa-solid fa-check-double"></i>
                  <span>
                    <strong>Patient-Centric Approach: </strong> Our focus is on
                    understanding and meeting the individual needs of each
                    patient.
                  </span>
                </li>
                <li>
                  <i className="fa-solid fa-check-double"></i>
                  <span>
                    <strong>Community Engagement: </strong>We actively
                    participate in community health initiatives to promote
                    wellness and education.
                  </span>
                </li>
                <li>
                  <i className="fa-solid fa-check-double"></i>
                  <span>
                    <strong>Compassionate Care: </strong> Our staff embodies the
                    values of empathy and respect in every interaction.
                  </span>
                </li>
              </ul>
              <p>
                We believe in a journey of health where support and guidance are
                paramount. Our dedicated team is here to ensure that your
                experience reflects our commitment to care and compassion.
              </p>
            </section>
          </section>
        </section>
      </section>
    </section>
    // ======= about us section end =======
  );
};

export default AboutUs;
