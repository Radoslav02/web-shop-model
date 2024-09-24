import React, { useState } from "react";
import { useSelector } from "react-redux";
import { db, storage } from "../firebase";
import { collection, addDoc } from "firebase/firestore";
import { RootState } from "../Redux/store";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NewItemModal.css";

const NewItemModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [gender, setGender] = useState("male");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const sizePattern = /^([A-Za-z0-9]{1,4})(,([A-Za-z0-9]{1,4}))*$/;

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prevImages) => [...prevImages, ...selectedFiles]);

      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(updatedImages);
    setImagePreviews(updatedPreviews);
  };

  const uploadImages = async () => {
    const imageUrls: string[] = [];

    for (const image of images) {
      const imageRef = ref(storage, `images/${Date.now()}_${image.name}`);
      const uploadTask = uploadBytesResumable(imageRef, image);

      const downloadURL = await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            reject(error);
          },
          async () => {
            try {
              const url = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(url);
            } catch (error) {
              reject(error);
            }
          }
        );
      });

      imageUrls.push(downloadURL);
    }

    return imageUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!sizePattern.test(size)) {
      toast.error(
        "Nepravilan format veličina. Molimo vas da dodate veličine odvojene zarezom (npr., L,M,S or 38,39,40)."
      );
      return;
    }

    setLoading(true);

    try {
      const imageUrls = await uploadImages();
      const sizes = size.toUpperCase().split(",").map((s) => s.trim());

      await addDoc(collection(db, "products"), {
        name,
        type,
        manufacturer,
        gender,
        size: sizes,
        price: parseFloat(price),
        images: imageUrls,
      });

      toast.success("Product added successfully!");
      setName("");
      setType("");
      setManufacturer("");
      setGender("male");
      setSize("");
      setPrice("");
      setImages([]);
      setImagePreviews([]);
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error("Error adding product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user || !user.isAdmin) {
    return <p>Nemaš dozvolu da dodaješ proizvode.</p>;
  }

  return (
    <div className="new-item-modal-container">
      <form className="new-item-form" onSubmit={handleSubmit}>
        <h2>Dodavanje proizvoda</h2>
        <div className="new-item-input-wrapper">
          <label>Ime:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="new-item-input-wrapper">
          <label>Kategorija:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>
        <div className="new-item-input-wrapper">
          <label>Proizvođač:</label>
          <input
            type="text"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            required
          />
        </div>
        <div className="new-item-input-wrapper">
          <label>Pol:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="male">Muški</option>
            <option value="female">Ženski</option>
          </select>
        </div>
        <div className="new-item-input-wrapper">
          <label>Veličine:</label>
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            pattern="^([A-Za-z0-9]{1,4})(,([A-Za-z0-9]{1,4}))*$"
            title="Veličine dodajte sa zarezom (npr., L,M,S or 38,39,40)"
          />
        </div>
        <div className="new-item-input-wrapper">
          <label>Cena:</label>
          <input
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <div className="new-item-input-wrapper">
          <label>Slike:</label>
          <input type="file" className="image-input" multiple onChange={handleImagesChange} required />
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <div className="image-preview-wrapper" key={index}>
                <img src={preview} alt={`preview ${index}`} className="image-preview" />
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={() => handleRemoveImage(index)}
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="new-item-button-wrapper">
          <button className="add-button" type="submit" disabled={loading}>
            {loading
              ? `Dodavanje ${Math.round(uploadProgress)}%`
              : "Dodaj proizvod"}
          </button>
          <button className="close-button" onClick={onClose}>
            Odustani
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewItemModal;
