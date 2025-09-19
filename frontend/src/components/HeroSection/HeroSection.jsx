import React from "react";

const HeroSection = () => {
  return (
    // ======= hero section start =======
    <section id="hero" className="hero-section">
      <section className="hero-section-container">
        <section className="hero-content">
          <h1>
            Where Care Meets Compassion—Like a <em>Mother's Embrace.</em>
          </h1>
          <p>
            At Enat Health Care Solutions, we believe everyone deserves
            compassionate, comprehensive care. Our philosophy is simple:
            <strong>
              <em>"Where Care Meets Compassion—Like a Mother's Embrace."</em>
            </strong>
            Health is more than treatment; it’s about nurturing each person,
            just as a mother cares for her child.
          </p>
          <a href="index.html#appointment" className="main-btn">
            Make An Appointment
          </a>
          <a
            href="calcBmi.html"
            target="_blank"
            rel="no-referrer"
            className="main-btn-light"
          >
            Calculate BMI
          </a>
        </section>
      </section>
    </section>
    //    ======= hero section end =======
  );
};

export default HeroSection;
