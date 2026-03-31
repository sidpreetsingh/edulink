import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Signup from "./pages/signup";
import GuestLayout from "./components/guestLayout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<GuestLayout/>}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<div>Hiiiii</div>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}