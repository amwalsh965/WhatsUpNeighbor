import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import arrowLeft from "../assets/leftpoint.png";
import arrowRight from "../assets/rightpoint.png";

export default function SignupFlow() {
  const token = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [addressName, setAddressName] = useState("");

  const [signupData, setSignupData] = useState({
    username: "",
    password: "",
    avatar: "",
    f_name: "",
    l_name: "",
    email: "",
    bio: "",
    website: "",
    items: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    address_id: "",
    neighborhood: "",
    neighborhood_pk: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("http://127.0.0.1:8000/main/current-user/", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            });
        const data = await res.json();
        if (data.authenticated) navigate("/");
      } catch (err) {
        console.error("Auth check failed", err);
      }
    }
    checkAuth();
  }, [navigate]);

  const handleNext = () => setStep((s) => Math.min(s + 1, 3));
  const handleBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleChange = (field, value) =>
    setSignupData((prev) => ({ ...prev, [field]: value }));

  const handleSignup = async () => {
  try {
    const formData = new FormData();
    Object.entries(signupData).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
    });

    const res = await fetch("http://127.0.0.1:8000/main/auth/signup/", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      localStorage.setItem("accessToken", data.access); 
      localStorage.setItem("refreshToken", data.refresh);
      navigate("/");
    }
    else setError(data.error);
  } catch (err) {
    console.error(err);
    setError("Signup failed. Try again.");
  }
};

  const handleAddress = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/main/api/get_nearest_neighborhood/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            street: signupData.street,
            city: signupData.city,
            state: signupData.state,
            zip_code: signupData.zipCode,
            country: signupData.country,
          }),
        }
      );

      const data = await res.json();
      console.log(data);

      if (data.success) {
        // Update state properly
        setSignupData((prev) => ({
          ...prev,
          neighborhood: data.neighborhood,
          neighborhood_pk: data.neighborhood_pk,
          address_id: data.address_id,
        }));
        setAddressName(data.neighborhood_name); // This will trigger re-render
      } else {
        setError(data.error);
      }
    } catch (err) {
      console.error(err);
      setError("Signup failed. Neighborhood get failed.");
    }
  };

  const titles = ["Terms of Service", "Profile", "Address", "Neighborhood"];

  return (
    <div className="sf-screen">
      <TopBar
        title={titles[step]}
        showBack={step !== 0}
        showNext={step !== 3}
        onBack={handleBack}
        onNext={step < 3 ? handleNext : handleSignup}
      />

      <div className="sf-body">
        {step === 0 && <TermsScreen onAgree={handleNext} />}
        {step === 1 && (
          <ProfileScreen signupData={signupData} handleChange={handleChange} handleNext={handleNext} />
        )}
        {step === 2 && (
          <AddressScreen signupData={signupData} handleChange={handleChange} handleNext={handleNext} />
        )}
        {step === 3 && (
          <NeighborhoodScreen
            signupData={signupData}
            handleChange={handleChange}
            onSignup={handleSignup}
            handleNext={handleNext}
            handleAddress={handleAddress}
            addressName={addressName}
          />
        )}
      </div>

      {error && <div className="sf-error">{error}</div>}
    </div>
  );
}


function TermsScreen({ onAgree }) {
  return (
    <div className="sf-center">
      <div className="sf-terms-title">Terms & Agreements</div>
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
      <button className="sf-primary-btn" onClick={onAgree}>
        I Agree
      </button>
    </div>
  );
}

function ProfileScreen({ signupData, handleChange, handleNext}) {
  return (
    <div className="profile-ui">
      <h2 className="section-title">Profile Information</h2>

      <div className="profile-ui__content">
        <div className="profile-ui__left">
          <label className="profile-ui__label" htmlFor="username">
            User Name
          </label>
          <input
            id="username"
            type="text"
            className="profile-ui__input"
            placeholder="Enter Username"
            value={signupData.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />

          <label className="profile-ui__label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="text"
            className="profile-ui__input"
            placeholder="Enter Email"
            value={signupData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <label className="profile-ui__label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="text"
            className="profile-ui__input"
            placeholder="Enter Password"
            value={signupData.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />

          <label className="profile-ui__label" htmlFor="avatar">
            Profile Photo
          </label>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            className="profile-ui__input"
            onChange={(e) => {
              if (e.target.files.length > 0) {
                handleChange("avatar", e.target.files[0]);
              }
            }}
          />

          {signupData.avatar && (
            <div style={{ marginTop: "10px" }}>
              <img
                src={URL.createObjectURL(signupData.avatar)}
                alt="Preview"
                width={120}
                style={{ borderRadius: "8px" }}
              />
            </div>
          )}

          <label className="profile-ui__label" htmlFor="f_name">
            First Name
          </label>
          <input
            id="f_name"
            type="text"
            className="profile-ui__input"
            placeholder="Enter First Name"
            value={signupData.f_name}
            onChange={(e) => handleChange("f_name", e.target.value)}
          />

          <label className="profile-ui__label" htmlFor="l_name">
            Last Name
          </label>
          <input
            id="l_name"
            type="text"
            className="profile-ui__input"
            placeholder="Enter Last Name"
            value={signupData.l_name}
            onChange={(e) => handleChange("l_name", e.target.value)}
          />

          <label className="profile-ui__label" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            className="profile-ui__textarea"
            placeholder="Tell us a bit about yourself"
            value={signupData.bio}
            onChange={(e) => handleChange("bio", e.target.value)}
          />

          <label className="profile-ui__label" htmlFor="website">
            Website
          </label>
          <input
            id="website"
            type="text"
            className="profile-ui__input"
            placeholder="Add your website"
            value={signupData.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />

          <button
            className="profile-ui__primarybtn"
            onClick={handleNext}
          > Next </button>
        </div>
      </div>
    </div>
  );
}

function AddressScreen({ signupData, handleChange, handleNext }) {
  return (
    <div className="sf-card sf-center">
      <h2 className="sf-section-title">Address</h2>

      <input
        className="sf-input"
        placeholder="Street Address"
        value={signupData.street || ""}
        onChange={(e) => handleChange("street", e.target.value)}
      />

      <input
        className="sf-input"
        placeholder="City"
        value={signupData.city || ""}
        onChange={(e) => handleChange("city", e.target.value)}
      />

      <input
        className="sf-input"
        placeholder="State"
        value={signupData.state || ""}
        onChange={(e) => handleChange("state", e.target.value)}
      />

      <input
        className="sf-input"
        placeholder="Zip Code"
        value={signupData.zipCode || ""}
        onChange={(e) => handleChange("zipCode", e.target.value)}
      />

      <input
        className="sf-input"
        placeholder="Country"
        value={signupData.country || ""}
        onChange={(e) => handleChange("country", e.target.value)}
      />

      <button
        className="profile-ui__primarybtn"
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}

function NeighborhoodScreen({ signupData, handleChange, onSignup, handleNext, handleAddress, addressName }) {
  useEffect(() => {
    handleAddress();
  }, []);
  return (
    <div className="sf-card sf-center">
      <h2 className="sf-section-title">Neighborhood</h2>
      <input
        className="sf-input"
        value={addressName}
        onChange={(e) => handleChange("neighborhood", e.target.value)}
        disabled
      />
      <button className="sf-btn sf-btn-primary" onClick={onSignup}>
        Join Neighborhood
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
      >
        <img src={arrowLeft} alt="Back" className="sf-arrow-icon" />
      </button>
      <div className="sf-topbar-title">{title}</div>
      <button
        className={`sf-topbar-btn ${showNext ? "" : "sf-disabled"}`}
        onClick={onNext}
      >
        <img src={arrowRight} alt="Next" className="sf-arrow-icon" />
      </button>
    </div>
  );
}