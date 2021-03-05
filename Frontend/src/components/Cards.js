import React from "react";
import CardItem from "./CardItem";
import "../css/Cards.css";

function Cards() {
  return (
    <div className="cards">
      {/* <h1>Check out these opportunities!</h1> */}
      <div className="cards__container">
        <div className="cards__wraps">
          <ul className="cards__items">
            <CardItem
              src="images/image-hotel.jpg"
              text="Explore the amazing Hotels"
              label="Hotels"
              path="/hotels"
            />
            <CardItem
              src="images/image-space.jpg"
              text="Enjoy wonderful spaces"
              label="Spaces"
              path="/spaces"
            />
            <CardItem
              src="images/image-aboutus.jpg"
              text="Want to know a little more about us?"
              label="About Us"
              path="/aboutus"
            />
            <CardItem
              src="images/image-infocovid.jpg"
              text="Know all the measures before the covid"
              label="COVID-19"
              path="/infocovid"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
