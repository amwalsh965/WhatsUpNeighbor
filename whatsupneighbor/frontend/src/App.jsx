import BorrowPage from "./pages/BorrowPage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import EventsPage from "./pages/EventsPage";
import Message from "./pages/MessagePage";
import Profile from "./pages/Profile";
import ListingDetailsPage from "./pages/ListingsDetailsPage";
import AuthPage from "./pages/AuthPage";
import SignUpFlow from "./pages/SignUpFlow";
import Saved from "./pages/Saved";
import LendPage from "./pages/LendPage";
import ConnectPage from "./pages/ConnectPage";
import TrustFeedback from "./pages/TrustFeedback";
import ProtectedRoute from "./components/ProtectedRoute";
import TransactionHistory from "./pages/TransactionHistory";
import SearchMember from "./pages/SearchMember";
import ViewProfile from "./pages/ViewProfile";
import DMPage from "./pages/DMPage";
import AdminUserChatsPage from "./pages/AdminUserChatsPage";

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
	      <Route path="/members/:id/transactions" element={<ProtectedRoute><TransactionHistory /></ProtectedRoute>} />
        <Route path="/search-members" element={<ProtectedRoute><SearchMember /></ProtectedRoute>} />
        <Route path="/members/:id" element={<ProtectedRoute><ViewProfile /></ProtectedRoute>} />
        <Route path="/listing-details/:id" element={<ProtectedRoute><ListingDetailsPage /></ProtectedRoute>} />
        <Route path="/chats/:id" element={<ProtectedRoute><DMPage /></ProtectedRoute>} />
        <Route path="/admin/users/:id/chats" element={<ProtectedRoute><AdminUserChatsPage /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App
