import { Routes, Route } from "react-router-dom";
import ListCs from "./screens/ListClothes";
import UploadCs from "./screens/UploadClothes"; 
import Login from "./screens/Login";
import Details from "./screens/Details";
import UpdateClothes from "./screens/UpdateClothes";
import "./App.css";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ListCs />} />
      <Route path="/upload" element={<UploadCs />} />
      <Route path="/login" element={<Login />} />
      <Route path="/details/:id" element={<Details />} />
      <Route path="/update/:id" element={<UpdateClothes />} />
    </Routes>
  );
}