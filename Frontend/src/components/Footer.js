import React from "react";
import "../css/Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <div className="footer-container">
      <div class="footer-links">
        <div className="footer-link-wrapper">
          <div class="footer-link-items">
            <h3>
              <Link to="/">Terms of Service</Link>
            </h3>
          </div>
          <div class="footer-link-items">
            <h3>
              <Link to="/">User privacy</Link>
            </h3>
          </div>
        </div>
        <div className="footer-link-wrapper">
          <div class="footer-link-items">
            <h3>
              <Link to="/">Contact Us</Link>
            </h3>
          </div>
          <div class="footer-link-items">
            <h3>
              <Link to="/">FAQ Covid-19</Link>
            </h3>
          </div>
        </div>
      </div>
      <section class="social-media">
        <div class="social-media-wrap">
          <div class="footer-logo">
            <Link to="/" className="social-logo">
              <img className="logoParlor" src="images/logoParlor.png" alt="" />
            </Link>
          </div>
          <small class="website-rights">Parlor S.L. © 2020</small>
          <div class="social-icons">
            <Link
              class="social-icon-link facebook"
              to="/"
              target="_blank"
              aria-label="Facebook"
            >
              <i class="fab fa-facebook-f" />
            </Link>
            <Link
              class="social-icon-link instagram"
              to="/"
              target="_blank"
              aria-label="Instagram"
            >
              <i class="fab fa-instagram" />
            </Link>
            <Link
              class="social-icon-link twitter"
              to="/"
              target="_blank"
              aria-label="Twitter"
            >
              <i class="fab fa-twitter" />
            </Link>
            <Link
              class="social-icon-link twitter"
              to="/"
              target="_blank"
              aria-label="LinkedIn"
            >
              <i class="fab fa-linkedin" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
