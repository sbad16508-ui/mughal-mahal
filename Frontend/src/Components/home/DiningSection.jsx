import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useInView } from "react-intersection-observer";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DiningSection.css";

const DiningSection = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section ref={ref} className="dining-section py-5">
      <Container>
        <Row className="justify-content-center text-center">
          <Col lg={8}>

            <p className={`dining-tag ${inView ? "active" : ""}`}>
              Great Food
            </p>

            <h2 className={`dining-title ${inView ? "active delay-1" : ""}`}>
              Explore & Experience
              <br /> The Magical Food of Mughal Mahal
            </h2>

            <p className={`dining-description ${inView ? "active delay-2" : ""}`}>
              We come with different and unique themes to enhance your dining experience.
              Dining-out in Gujranwala has never been the same since we opened our first
              restaurant in 2013. We offer Mughlai, Chinese, Thai, Continental, BBQ and
              many more cuisines.
            </p>

          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default DiningSection;
