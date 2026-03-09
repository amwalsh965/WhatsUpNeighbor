import BorrowPage from "./pages/BorrowPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventsPage from "./pages/EventsPage";
import Message from "./pages/Message";
import Profile from "./pages/Profile";
import ListingDetailsPage from "./pages/ListingsDetailsPage";
import AuthPage from "./pages/AuthPage";
import SignUpFlow from "./pages/SignUpFlow";
import Saved from "./pages/Saved";
import LendPage from "./pages/LendPage";
import ConnectPage from "./pages/ConnectPage";
import TrustFeedback from "./pages/TrustFeedback";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/sign-up" element={<SignUpFlow />} />

        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/events" element={<ProtectedRoute><EventsPage /></ProtectedRoute>} />
        <Route path="/listing-details" element={<ProtectedRoute><ListingDetailsPage /></ProtectedRoute>} />
        <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
        <Route path="/messages" element={<ProtectedRoute><Message /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/borrow" element={<ProtectedRoute><BorrowPage /></ProtectedRoute>} />
        <Route path="/lend" element={<ProtectedRoute><LendPage /></ProtectedRoute>} />
        <Route path="/connect" element={<ProtectedRoute><ConnectPage /></ProtectedRoute>} />
        <Route path="/trust-feedback" element={<ProtectedRoute><TrustFeedback /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App
