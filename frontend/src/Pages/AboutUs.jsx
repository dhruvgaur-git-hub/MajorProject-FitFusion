import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar1 from "../Components/Navbar1";

const differentiators = [
  {
    icon: "🏬",
    title: "Multi-Retailer Marketplace",
    desc: "Multiple verified retailers list the same products side by side, so pricing is competitive by design — the platform automatically surfaces the best price for you.",
  },
  {
    icon: "🤖",
    title: "EFusyn AI Assistant",
    desc: "Our built-in AI doesn't just answer fitness & nutrition questions — it can search the live catalog, check real stock, and recommend products in the same conversation.",
  },
  {
    icon: "⚡",
    title: "Real-Time Inventory",
    desc: "Stock is deducted the instant a payment is confirmed, so what you see in a listing is what's actually available — no overselling, no surprises.",
  },
  {
    icon: "🔒",
    title: "Secure Checkout",
    desc: "Payments run through Razorpay with signature verification on every transaction, so your money and your order are always in sync.",
  },
  {
    icon: "🔄",
    title: "Hassle-Free Returns",
    desc: "A dedicated returns, exchanges, and refunds flow — not a bolted-on afterthought — so post-purchase support is built into the platform itself.",
  },
  {
    icon: "✅",
    title: "Verified Retailers Only",
    desc: "Every retailer and every product goes through admin approval before it ever reaches the storefront, keeping quality and trust consistent.",
  },
];

const stats = [
  { value: "10,000+", label: "Future Customers", color: "#ff6b35", bg: "#fff3ec" },
  { value: "500+", label: "Fitness Products", color: "#3b82f6", bg: "#eef4ff" },
  { value: "EFusyn AI", label: "Your Personal Fitness Guide", color: "#8b5cf6", bg: "#f5f0ff" },
  { value: "24/7", label: "Customer Support", color: "#14b8a6", bg: "#e8faf7" },
];

const team = [
  { name: "Kunal Sharma", role: "Co-Founder & Product Developer", initials: "KS" },
  { name: "Varsha", role: "Co-Founder & Product Developer", initials: "VB" },
  { name: "Mohit", role: "Co-Founder & Product Developer", initials: "MC" },
  { name: "Dhruv Gaur", role: "Co-Founder & Product Developer", initials: "DG" },
];

const offerings = [
  { icon: "👟", label: "Sports Shoes & Athletic Wear" },
  { icon: "🏋️", label: "Gym Equipment & Accessories" },
  { icon: "💊", label: "Health & Nutritional Supplements" },
  { icon: "⌚", label: "Fitness Gadgets & Smart Devices" },
  { icon: "🧘", label: "Yoga & Wellness Products" },
  { icon: "🥤", label: "Sports Nutrition & Recovery Essentials" },
];

function AboutUs() {
  const navigate = useNavigate();

  return (
    <div>
      <Navbar1 />

      {/* Hero */}
      <div className="about-hero">
        <div className="container text-center">
          <span className="about-hero-badge">About FitFusion</span>
          <h1 className="about-hero-title">
            Fitness shopping, <span className="text-brand">reimagined.</span>
          </h1>
          <p className="about-hero-subtitle">
            One marketplace, many trusted retailers, an AI that actually knows your catalog —
            built to make finding and buying the right fitness gear effortless.
          </p>

          <div className="about-hero-pills">
            <span className="about-pill">🏬 Multi-Retailer Marketplace</span>
            <span className="about-pill">🤖 AI Shopping Assistant</span>
            <span className="about-pill">🔒 Secure Payments</span>
            <span className="about-pill">🔄 Easy Returns</span>
          </div>

          <button className="btn btn-brand about-hero-cta" onClick={() => navigate("/home")}>
            Explore Products
          </button>
        </div>
      </div>

      <div className="container my-5">

        {/* Stats */}
        <div className="row text-center mb-5 g-3">
          {stats.map((stat) => (
            <div className="col-6 col-md-3" key={stat.label}>
              <div className="about-stat-card" style={{ background: stat.bg }}>
                <h2 style={{ color: stat.color }}>{stat.value}</h2>
                <p className="mb-0 text-muted">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Who We Are */}
        <div className="card shadow-sm p-4 mb-4 border-0 about-section-card">
          <h3 className="about-heading">Who We Are</h3>

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

          <p className="mb-0">
            We believe fitness is not just a routine but a lifestyle. Our mission
            is to make quality fitness products accessible while promoting healthier
            living through technology and innovation.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="row mb-4 g-3">
          <div className="col-md-6">
            <div className="card shadow-sm p-4 h-100 border-0 about-section-card">
              <h3 className="about-heading">Our Mission</h3>
              <ul className="mb-0">
                <li>Provide premium fitness and wellness products.</li>
                <li>Promote healthier lifestyles through technology.</li>
                <li>Offer a secure and user-friendly shopping experience.</li>
                <li>Encourage fitness awareness and wellness education.</li>
                <li>Build a trusted fitness ecosystem for everyone.</li>
              </ul>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card shadow-sm p-4 h-100 border-0 about-section-card">
              <h3 className="about-heading">Our Vision</h3>
              <p className="mb-0">
                To become India's most trusted digital fitness and wellness
                ecosystem by integrating quality products, expert guidance,
                and innovative technology into a single platform.
              </p>
            </div>
          </div>
        </div>

        {/* What Makes Us Different */}
        <div className="mb-5">
          <h3 className="about-heading about-heading-center mb-1">What Makes FitFusion Different</h3>
          <p className="text-muted text-center mb-4">
            We didn't just build another storefront — here's what's actually under the hood.
          </p>

          <div className="row g-3">
            {differentiators.map((item) => (
              <div className="col-md-4" key={item.title}>
                <div className="about-feature-card h-100">
                  <div className="about-feature-icon">{item.icon}</div>
                  <h5 className="mb-2">{item.title}</h5>
                  <p className="text-muted mb-0 small">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What We Offer */}
        <div className="card shadow-sm p-4 mb-4 border-0 about-section-card">
          <h3 className="about-heading mb-3">What We Offer</h3>

          <div className="row g-3">
            {offerings.map((item) => (
              <div className="col-md-6" key={item.label}>
                <div className="about-offer-item">
                  <span className="about-offer-icon">{item.icon}</span>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Future Scope */}
        <div className="card shadow-sm p-4 mb-4 border-0 about-section-card">
          <h3 className="about-heading">Future Scope</h3>

          <p>
            FitFusion aims to evolve beyond e-commerce into a complete fitness
            ecosystem. Future enhancements include:
          </p>

          <div className="d-flex flex-wrap gap-2">
            <span className="about-pill about-pill-light">Certified Trainer Consultation</span>
            <span className="about-pill about-pill-light">Personalized Workout Programs</span>
            <span className="about-pill about-pill-light">Custom Diet & Nutrition Planning</span>
            <span className="about-pill about-pill-light">AI-Powered Fitness Recommendations</span>
            <span className="about-pill about-pill-light">Health Progress Tracking</span>
            <span className="about-pill about-pill-light">Community Fitness Support</span>
            <span className="about-pill about-pill-light">Online Coaching & Wellness Sessions</span>
          </div>
        </div>

        {/* Team */}
        <div className="card shadow-sm p-4 mb-4 border-0 about-section-card">
          <h3 className="about-heading about-heading-center mb-4">Core Development Team</h3>

          <div className="row g-3">
            {team.map((member) => (
              <div className="col-6 col-md-3" key={member.name}>
                <div className="team-card">
                  <div className="team-avatar">{member.initials}</div>
                  <h6 className="mb-1">{member.name}</h6>
                  <p className="text-muted small mb-0">{member.role}</p>
                </div>
              </div>
            ))}
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

      <style>{`
        .about-hero {
          background: linear-gradient(160deg, #1a1d29 0%, #23273a 100%);
          padding: 70px 20px 60px;
          color: #fff;
        }
        .about-hero-badge {
          display: inline-block;
          background: rgba(255, 107, 53, 0.15);
          color: #ff6b35;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          padding: 6px 16px;
          border-radius: 999px;
          margin-bottom: 18px;
        }
        .about-hero-title {
          font-weight: 800;
          font-size: 2.6rem;
          margin-bottom: 16px;
        }
        .about-hero-subtitle {
          color: #c7cad1;
          max-width: 620px;
          margin: 0 auto 28px;
          font-size: 1.05rem;
        }
        .about-hero-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 30px;
        }
        .about-pill {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        .about-pill-light {
          background: #ffede5;
          color: #b8441f;
        }
        .about-hero-cta {
          padding: 10px 32px;
          font-weight: 600;
          border-radius: 999px;
        }
        .about-stat-card {
          background: #fff;
          border-radius: 14px;
          padding: 22px 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.06);
        }
        .about-stat-card h2 {
          font-weight: 800;
          margin-bottom: 4px;
          font-size: 1.7rem;
        }
        .about-section-card {
          border-radius: 14px;
        }
        .about-heading {
          display: inline-block;
          position: relative;
          color: #312e81;
          font-weight: 700;
          padding-bottom: 10px;
          margin-bottom: 14px;
        }
        .about-heading::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 42px;
          height: 3px;
          border-radius: 2px;
          background: #ff6b35;
        }
        .about-heading-center {
          display: block;
          text-align: center;
        }
        .about-heading-center::after {
          left: 50%;
          transform: translateX(-50%);
        }
        .about-feature-card {
          background: #fff;
          border-radius: 14px;
          padding: 22px;
          border: 1px solid #eceef1;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .about-feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0,0,0,0.07);
        }
        .about-feature-icon {
          width: 46px;
          height: 46px;
          border-radius: 12px;
          background: #ffede5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          margin-bottom: 14px;
        }
        .about-offer-item {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8f9fa;
          border-radius: 10px;
          padding: 12px 14px;
          font-weight: 500;
        }
        .about-offer-icon {
          font-size: 1.2rem;
        }
        .team-card {
          background: #f8f9fa;
          border-radius: 14px;
          padding: 22px 12px;
          text-align: center;
        }
        .team-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: #ffede5;
          color: #ff6b35;
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }
      `}</style>
    </div>
  );
}

export default AboutUs;
