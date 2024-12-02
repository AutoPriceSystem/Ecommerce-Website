import React from 'react';
import '../StyledComponents/style.css'; // Importing the CSS files
import '../StyledComponents/responsive.css'; // Importing the CSS files

const AboutUs = () => {
  return (
    <div className="responsive-container-block bigContainer">
      <div className="responsive-container-block Container">
        <img
          className="mainImg"
          src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/eaboutus1.svg"
          alt="About Us"
        />
        <div className="allText aboveText">
          <p className="text-blk headingText">About Us</p>
          <p className="text-blk description">
            At eTrade, we're more than just an online marketplace—we're a
            community of buyers and sellers, committed to bringing you the best
            shopping experience possible. Whether you're looking for the latest
            gadgets, fashion items, home goods, or more, eTrade offers a wide
            variety of products from trusted brands at competitive prices.
          </p>
        </div>
      </div>
      <div className="responsive-container-block Container bottomContainer">
        <img
          className="mainImg"
          src="https://workik-widget-assets.s3.amazonaws.com/widget-assets/images/xpraup2.svg"
          alt="Our Vision"
        />
        <div className="allText bottomText">
          <p className="text-blk headingText">Our Vision</p>
          <p className="text-blk description">
            Our mission is simple: to empower our customers by providing a
            seamless, enjoyable, and reliable shopping experience. We aim to
            bring quality products, exceptional service, and fast shipping to
            your doorstep, all while making online shopping more accessible for
            everyone.
            <br />
            <br />
            We believe that shopping online should be easy, safe, and
            enjoyable—and that's exactly what we strive to deliver.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
