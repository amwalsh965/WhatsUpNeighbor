import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Event from "./pages/EventPage";
import Login from "./pages/Login";
import Message from "./pages/Message";
import Profile from "./pages/Profile";
import ListingDetailsPage from "./pages/ListingsDetailsPage";
import AuthPage from "./pages/AuthPage";
import SignUpFlow from "./pages/SignUpFlow";
import Saved from "./pages/Saved";


//Change Event to EventsPage in import and down below (for Sayman)
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/listing-details" element={<ListingDetailsPage />} />
        <Route path="/sign-up" element={<SignUpFlow />} />
        <Route path="/saved" element={<Saved />} />
        <Route path="/login" element={<Login />} />
        <Route path="/messages" element={<Message />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App
