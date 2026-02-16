import React, { useState } from "react";
import arrowLeft from "../assets/leftpoint.png";
import arrowRight from "../assets/rightpoint.png";

export default function SignupFlow() {
  // Order: 0 Terms, 1 Profile, 2 Address, 3 Neighborhood
  const [step, setStep] = useState(0);

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const goNext = () => setStep((s) => Math.min(3, s + 1));

  const title = step === 1 ? "Profile" : "";

  return (
    <div className="sf-screen">
      <TopBar
        title={title}
        showBack={step !== 0}
        showNext={step !== 3}
        onBack={goBack}
        onNext={goNext}
      />

      <div className="sf-body">
        {step === 0 && <TermsScreen />}
        {step === 1 && <ProfileScreen />}
        {step === 2 && <AddressScreen />}
        {step === 3 && <NeighborhoodRadiusScreen />}
      </div>
    </div>
  );
}

/* pages */

function TermsScreen() {
  return (
    <div className="sf-center">
      <div className="sf-terms-title">Terms &amp; Agreements</div>

      <div className="sf-terms-box">
        <div className="sf-terms-scrollhint" />
        <p className="sf-terms-text">
          When You create an account with Us, You must provide Us information
          that is accurate, complete, and current at all times. Failure to do so
          constitutes a breach of the Terms, which may result in immediate
          termination of Your account on Our Service. You are responsible for
          safeguarding the password that You use to access the Service and for
          any activities or actions under Your password, whether Your password
          is with Our Service or a Third-Party Social Media Service. You agree
          not to disclose Your password to any third party. You must notify Us
          immediately upon becoming aware of any breach of security or
          unauthorized use of Your account. You may not use as a username the
          name of another person or entity or that is not lawfully available
          for use, a name or trademark that is subject to any rights of another
          person or entity other than You without appropriate authorization, or
          a name that is otherwise offensive, vulgar or...
        </p>
      </div>

      <button className="sf-primary-btn">I Agree</button>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="sf-profile-wrap">
      <div className="sf-profile-left">
        <div className="sf-avatar">
          <div className="sf-avatar-inner" />
          <div className="sf-avatar-text">Add Image</div>
        </div>

        <input className="sf-input-teal-sm" placeholder="Enter Name" />
        <textarea className="sf-bio" placeholder="Add Bio" />
        <input className="sf-input-teal-sm" placeholder="Add Website" />
      </div>

      <div className="sf-profile-right">
        <div className="sf-field">
          <div className="sf-label">Items:</div>
          <input className="sf-input-teal" placeholder="Add Items" />
        </div>

        <div className="sf-field">
          <div className="sf-label">Skills:</div>
          <input className="sf-input-teal" placeholder="Add Skills" />
        </div>
      </div>
    </div>
  );
}

function AddressScreen() {
  return (
    <div className="sf-center">
      <div className="sf-block">
        <div className="sf-label">Address</div>
        <input className="sf-input-blue" placeholder="Start Typing Here" />
      </div>
    </div>
  );
}

function NeighborhoodRadiusScreen() {
  return (
    <div className="sf-center">
      <div className="sf-text">Neighborhood Radius</div>
      <button className="sf-radius-btn">5 miles</button>

      <div className="sf-spacer-xl" />

      <div className="sf-text">270 People in Community</div>
      <button className="sf-join-btn">
        Join <br /> Neighborhood
      </button>
    </div>
  );
}

function TopBar({ title, showBack, showNext, onBack, onNext }) {
    return (
      <div className="sf-topbar">
        <button
          className={`sf-topbar-btn ${showBack ? "" : "sf-disabled"}`}
          onClick={showBack ? onBack : undefined}
          aria-label="Back"
          type="button"
        >
          <img
            src={arrowLeft}
            alt="Back"
            className="sf-arrow-icon"
          />
        </button>
  
        <div className="sf-topbar-title">{title}</div>
  
        <button
          className={`sf-topbar-btn ${showNext ? "" : "sf-disabled"}`}
          onClick={showNext ? onNext : undefined}
          aria-label="Next"
          type="button"
        >
          <img
            src={arrowRight}
            alt="Next"
            className="sf-arrow-icon"
          />
        </button>
      </div>
    );
  }
  