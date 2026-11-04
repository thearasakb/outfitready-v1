import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Sparkles, Send, MapPin, Shuffle, Layers } from "lucide-react";
import { getAllClothes } from "../api/outfitAPI";
import "./ListClothes.css";

export default function ListClothes() {
  const [clothes, setClothes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [destination, setDestination] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // State สำหรับหมวดหมู่ที่เลือก

  const navigate = useNavigate();

  // รายการหมวดหมู่สำหรับสร้างปุ่มกด
  const categories = [
    { id: "all", label: "ทั้งหมด" },
    { id: "shirt", label: "เสื้อ" },
    { id: "pants", label: "กางเกง / กระโปรง" },
    { id: "dress", label: "ชุดเดรส" },
    { id: "shoes", label: "รองเท้า" },
    { id: "accessory", label: "เครื่องประดับ" },
  ];

  // 1) เปิดหน้า → โหลดรายการเสื้อผ้า
  useEffect(() => {
    loadClothes();
  }, []);

  async function loadClothes() {
    setIsLoading(true);
    try {
      const data = await getAllClothes();
      setClothes(data);
    } catch (error) {
      console.error("Error loading clothes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // 2) กรองเสื้อผ้าตามหมวดหมู่ที่เลือก
  const filteredClothes = selectedCategory === "all"
    ? clothes
    : clothes.filter((item) => item.category === selectedCategory);

  // 3) ฟังก์ชันแนะนำแบบรวดเร็ว
  const handleQuickRecommend = () => {
    if (clothes.length === 0) {
      alert("ยังไม่มีเสื้อผ้าในตู้เลยครับ เพิ่มเสื้อผ้าก่อนนะ!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * clothes.length);
    const randomItem = clothes[randomIndex];
    alert(`วันสบายๆ แนะนำให้ใส่ชุดนี้เลย: ${randomItem.name || "ชุดในตู้ของคุณ"}`);
  };

  // 4) ฟังก์ชันส่งงาน/สถานที่ไปให้ Gemini คำนวณ
  const handleSubmitPrompt = (e) => {
    e.preventDefault();
    if (!destination.trim()) {
      alert("กรุณากรอกงานหรือสถานที่ที่จะไปด้วยครับ");
      return;
    }
    alert(`กำลังส่งข้อมูลสถานที่: "${destination}" ไปให้ Gemini คำนวณชุด...`);
  };

  return (
    <div className="wardrobe-container">
      {/* Header หลัก */}
      <header className="wardrobe-header">
        <div className="brand-title">
          <h1>OutfitReady</h1>
          <p className="sub-title">ตู้เสื้อผ้าอัจฉริยะของคุณ</p>
        </div>

        <div className="header-actions">
          <button className="quick-recommend-btn" onClick={handleQuickRecommend}>
            <Shuffle size={16} />
            แนะนำแบบรวดเร็ว
          </button>

          <button className="add-btn" onClick={() => navigate("/upload")}>
            <Plus size={18} />
            เพิ่มเสื้อผ้า
          </button>
        </div>
      </header>

      {/* ส่วนกรอกงาน/สถานที่ สำหรับ Gemini คำนวณ */}
      <section className="prompt-section">
        <form className="prompt-form" onSubmit={handleSubmitPrompt}>
          <div className="input-wrapper">
            <MapPin size={20} className="input-icon" />
            <input
              type="text"
              placeholder="วันนี้จะไปไหน? (เช่น ไปสัมภาษณ์งาน, ไปเที่ยวทะเล, งานแต่งงาน)..."
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <button type="submit" className="submit-btn">
            <Sparkles size={18} />
            คำนวณชุด
            <Send size={16} />
          </button>
        </form>
      </section>

      {/* ส่วนเลือกหมวดหมู่เสื้อผ้า (Category Filter Buttons) */}
      <section className="category-section">
        <div className="category-buttons">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* หัวข้อ "เสื้อผ้าของคุณ" */}
      <div className="section-title">
        <h2>
          <Layers size={20} />
          เสื้อผ้าของคุณ
          <span className="count-badge">({filteredClothes.length})</span>
        </h2>
      </div>

      {/* Grid แสดงรูปภาพเสื้อผ้าที่ผ่านการกรอก */}
      {isLoading ? (
        <p className="status-text">กำลังโหลดตู้เสื้อผ้า...</p>
      ) : filteredClothes.length === 0 ? (
        <p className="status-text">
          {selectedCategory === "all"
            ? "ยังไม่มีรายการเสื้อผ้าในตู้"
            : "ไม่มีเสื้อผ้าในหมวดหมู่นี้"}
        </p>
      ) : (
        <div className="image-grid">
          {filteredClothes.map((item) => (
            <div
              key={item.id}
              className="image-card"
              onClick={() => navigate(`/details/${item.id}`)}
              title="คลิกเพื่อดูรายละเอียด"
            >
              <img
                src={`http://localhost:3000/uploads/${item.image_url}`}
                alt={item.name || "เสื้อผ้า"}
                className="clothing-image"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}