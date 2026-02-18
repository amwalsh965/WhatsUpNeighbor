import backArrow from "../assets/leftpoint.png";
import heartIcon from "../assets/heart.png";
import kayakImg from "../assets/kayak.png";
import "./../App.css"
import "./../index.css"

export default function ListingDetailsPage() {
  return (
    <div className="ld-screen">
      {/* Top bar */}
      <div className="ld-topbar">
        <button className="ld-back-btn" type="button">
          <img className="ld-back-icon" src={backArrow} alt="Back" />
        </button>
      </div>

      {/* Body */}
      <div className="ld-body">
        {/* Left: Image */}
        <div className="ld-left">
          <img className="ld-image" src={kayakImg} alt="Kayak listing" />
        </div>

        {/* Right: options */}
        <div className="ld-right">
          <button className="ld-outline-btn" type="button">
            Description
          </button>

          <button className="ld-outline-btn" type="button">
            Condition: Good
          </button>

          <button className="ld-primary-btn" type="button">
            Dates
          </button>

          <div className="ld-borrow-row">
            <button className="ld-primary-btn ld-borrow-btn" type="button">
              Borrow
            </button>

            <button className="ld-heart-btn" type="button" aria-label="Save">
              <img className="ld-heart-icon" src={heartIcon} alt="Save" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}