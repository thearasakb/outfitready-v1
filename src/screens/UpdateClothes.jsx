import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react";
import { getClothesById, updateClothes } from "../api/outfitAPI";
import "./UploadClothes.css";

export default function UpdateClothes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("shirt");
  const [description, setDescription] = useState(""); // 1. เพิ่ม state สำหรับ description
  const [currentImage, setCurrentImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 2) เปิดหน้า → โหลดข้อมูลเดิมมาใส่ Form
  useEffect(() => {
    loadItem();
  }, [id]);

  async function loadItem() {
    try {
      const data = await getClothesById(id);
      setName(data.name || "");
      setCategory(data.category || "shirt");
      setDescription(data.description || ""); // ดึงคำอธิบายเดิมมาใส่ใน state
      setCurrentImage(data.image_url || "");
    } catch (error) {
      console.error("Error loading clothes detail:", error);
      alert("ไม่สามารถดึงข้อมูลเสื้อผ้าได้");
      navigate("/");
    } finally {
      setIsLoading(false);
    }
  }

  // 3) เปลี่ยนรูปภาพใหม่
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // 4) กดบันทึกการแก้ไข
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("description", description); // 3. ส่ง description เข้า formData
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await updateClothes(id, formData);
      alert("แก้ไขข้อมูลสำเร็จ!");
      navigate(`/details/${id}`);
    } catch (error) {
      console.error("Error updating clothes:", error);
      alert("เกิดข้อผิดพลาดในการแก้ไขข้อมูล");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="upload-container">
        <p>กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  return (
    <div className="upload-container">
      <button className="back-btn" onClick={() => navigate(`/details/${id}`)}>
        <ArrowLeft size={18} /> ย้อนกลับ
      </button>

      <div className="upload-card">
        <div className="upload-header">
          <h2>แก้ไขข้อมูลเสื้อผ้า</h2>
          <p>ปรับเปลี่ยนรายละเอียดหรือรูปภาพเสื้อผ้าของคุณ</p>
        </div>

        <form onSubmit={handleSubmit} className="upload-form">
          <div className="image-upload-zone">
            <input
              type="file"
              accept="image/*"
              id="file-input"
              onChange={handleImageChange}
              hidden
            />
            <label htmlFor="file-input" className="file-drop-area">
              <div className="preview-container">
                <img
                  src={
                    previewUrl || `http://localhost:3000/uploads/${currentImage}`
                  }
                  alt="Preview"
                  className="image-preview"
                />
                <div className="change-image-overlay">
                  <Upload size={20} />
                  <span>เปลี่ยนรูปภาพ</span>
                </div>
              </div>
            </label>
          </div>

          <div className="form-fields">
            <div className="form-group">
              <label htmlFor="name">ชื่อเสื้อผ้า / ชุด</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">หมวดหมู่</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="shirt">เสื้อ (Shirt / Top)</option>
                <option value="pants">กางเกง / กระโปรง (Pants / Bottom)</option>
                <option value="dress">ชุดเดรส (Dress)</option>
                <option value="shoes">รองเท้า (Shoes)</option>
                <option value="accessory">เครื่องประดับ / อื่นๆ (Accessory)</option>
              </select>
            </div>

            {/* 4. ช่องกรอกรายละเอียดเพิ่มเติม */}
            <div className="form-group">
              <label htmlFor="description">รายละเอียดเพิ่มเติม (Optional)</label>
              <textarea
                id="description"
                rows="3"
                placeholder="เช่น ใส่สำหรับงานทางการ, ผ้าระบายอากาศได้ดี..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <button type="submit" className="submit-upload-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                "กำลังบันทึก..."
              ) : (
                <>
                  <Save size={18} />
                  บันทึกการแก้ไข
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}