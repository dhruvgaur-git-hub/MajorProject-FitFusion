import React from "react";
import logo from "../assets/logo.png";
import Navbar1 from "../Components/Navbar1";

function AboutUs() {
  return (
    <div>
        <Navbar1 />
    
    <div className="container my-5">
         <img src={logo} alt="FitFusion Logo" className="img-fluid rounded mb-4"  />

      <div className="text-center mb-5">
        <h1 className="fw-bold text-success">About FitFusion</h1>

        <p className="lead">
          Your One-Stop Destination for Fitness, Wellness, and Healthy Living
        </p>

        <p className="text-muted">
          Empowering healthier lifestyles through innovation, fitness, and wellness.
        </p>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h3 className="text-success">Who We Are</h3>

        <p>
          FitFusion is a comprehensive fitness and wellness e-commerce platform
          designed to provide everything fitness enthusiasts need in one place.
          Our platform brings together premium fitness products, sports equipment,
          nutritional supplements, wellness essentials, and health-focused
          solutions to support individuals in achieving their fitness goals.
        </p>

        <p>
          Whether you are a beginner starting your fitness journey or a professional
          athlete striving for peak performance, FitFusion offers a seamless and
          reliable shopping experience tailored to your needs.
        </p>

        <p>
          We believe fitness is not just a routine but a lifestyle. Our mission
          is to make quality fitness products accessible while promoting healthier
          living through technology and innovation.
        </p>
      </div>

      <div className="row mb-4">

        <div className="col-md-6">
          <div className="card shadow-sm p-4 h-100">
            <h3 className="text-success">Our Mission</h3>

            <ul>
              <li>Provide premium fitness and wellness products.</li>
              <li>Promote healthier lifestyles through technology.</li>
              <li>Offer a secure and user-friendly shopping experience.</li>
              <li>Encourage fitness awareness and wellness education.</li>
              <li>Build a trusted fitness ecosystem for everyone.</li>
            </ul>

          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm p-4 h-100">
            <h3 className="text-success">Our Vision</h3>

            <p>
              To become India's most trusted digital fitness and wellness
              ecosystem by integrating quality products, expert guidance,
              and innovative technology into a single platform.
            </p>

          </div>
        </div>

      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h3 className="text-success">What We Offer</h3>

        <div className="row mt-3">

          <div className="col-md-6">
            <ul>
              <li>Sports Shoes & Athletic Wear</li>
              <li>Gym Equipment & Accessories</li>
              <li>Health & Nutritional Supplements</li>
            </ul>
          </div>

          <div className="col-md-6">
            <ul>
              <li>Fitness Gadgets & Smart Devices</li>
              <li>Yoga & Wellness Products</li>
              <li>Sports Nutrition & Recovery Essentials</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h3 className="text-success">Why Choose FitFusion?</h3>

        <div className="row mt-3">

          <div className="col-md-6">
            <ul>
              <li>Wide range of trusted fitness products.</li>
              <li>Secure payment and checkout process.</li>
              <li>Easy order tracking and management.</li>
            </ul>
          </div>

          <div className="col-md-6">
            <ul>
              <li>User-friendly and responsive platform.</li>
              <li>Dedicated customer support.</li>
              <li>Reliable and quality-focused services.</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h3 className="text-success">Future Scope</h3>

        <p>
          FitFusion aims to evolve beyond e-commerce into a complete fitness
          ecosystem. Future enhancements include:
        </p>

        <ul>
          <li>Certified Trainer Consultation Services</li>
          <li>Personalized Workout Programs</li>
          <li>Customized Diet & Nutrition Planning</li>
          <li>AI-Powered Fitness Recommendations</li>
          <li>Workout & Health Progress Tracking</li>
          <li>Community-Based Fitness Support</li>
          <li>Online Fitness Coaching & Wellness Sessions</li>
        </ul>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h3 className="text-success text-center mb-4">
          Our Vision in Numbers
        </h3>

        <div className="row text-center">

          <div className="col-md-3">
            <h2 className="text-success">10,000+</h2>
            <p>Future Customers</p>
          </div>

          <div className="col-md-3">
            <h2 className="text-success">500+</h2>
            <p>Fitness Products</p>
          </div>

          <div className="col-md-3">
            <h2 className="text-success">100+</h2>
            <p>Certified Trainers</p>
          </div>

          <div className="col-md-3">
            <h2 className="text-success">24/7</h2>
            <p>Customer Support</p>
          </div>

        </div>
      </div>

      <div className="card shadow-sm p-4 mb-4">
        <h3 className="text-success text-center mb-4">
          Core Development Team
        </h3>

        <div className="table-responsive">

          <table className="table table-bordered text-center">

            <thead className="table-success">
              <tr>
                <th>Name</th>
                <th>Designation</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>Kunal Sharma</td>
                <td>Co-Founder & Product Developer</td>
              </tr>

              <tr>
                <td>Dhruv Gaur</td>
                <td>Co-Founder & Product Developer</td>
              </tr>

              <tr>
                <td>Mohit</td>
                <td>Co-Founder & Product Developer</td>
              </tr>

              <tr>
                <td>Varsha</td>
                <td>Co-Founder & Product Developer</td>
              </tr>
            </tbody>

          </table>

        </div>
      </div>

      <div className="text-center mt-5">
        <blockquote className="blockquote">
          <p className="mb-0">
            "Transforming lives through fitness, wellness, and innovation."
          </p>
        </blockquote>

        <footer className="blockquote-footer mt-2">
          Team FitFusion
        </footer>
      </div>

    </div>
    </div>
  );
}

export default AboutUs;