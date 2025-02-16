import React, { useState } from "react";
import { db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./EditItemModal.css";

type Product = {
  productId: string;
  name: string;
  type: string;
  manufacturer: string;
  gender: "male" | "female";
  size: string[];
  price: number;
  images: string[];
  category: string;
  description: string;
};

const EditItemModal: React.FC<{ product: Product; onClose: () => void }> = ({
  product,
  onClose,
}) => {
  const [name, setName] = useState(product.name);
  const [type, setType] = useState(product.type);
  const [manufacturer, setManufacturer] = useState(product.manufacturer);
  const [gender, setGender] = useState(product.gender);
  const [size, setSize] = useState(product.size.join(","));
  const [price, setPrice] = useState(String(product.price));
  const [category, setCategory] = useState(product.category);
  const [description, setDescription] = useState(product.description); // New state for description
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(product.images);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const sizePattern = /^([A-Za-z0-9]{1,4})(,([A-Za-z0-9]{1,4}))*$/;

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      const totalImages = images.length + selectedFiles.length;
  
      if (totalImages > 5) {
        toast.error("Maksimalan broj slika je 5.");
        return; 
      }
  
      setImages((prevImages) => [...prevImages, ...selectedFiles]);
  
      const previews = selectedFiles.map((file) => URL.createObjectURL(file));
      setImagePreviews((prevPreviews) => [...prevPreviews, ...previews]);
    }
  };
  

  const removeImage = (index: number) => {
    const imageUrl = imagePreviews[index];
    setRemovedImages((prev) => [...prev, imageUrl]);

    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);

    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const uploadImages = async () => {
    const imageUrls: string[] = [...product.images]; // Sačuvaj postojeće slike
  
    for (const image of images) {
      // Proveri da li slika već postoji
      const existingImageUrl = product.images.find((url) =>
        url.includes(image.name)
      );
  
      if (existingImageUrl) {
        // Ako slika postoji, koristi postojeći URL
        imageUrls.push(existingImageUrl);
        continue;
      }
  
      // Ako slika ne postoji, otpremi novu sliku
      const imageRef = ref(storage, `images/${image.name}`);
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
        "Nepravilan format veličina. Molimo vas da dodate veličine odvojene zarezom."
      );
      return;
    }
  
    setLoading(true);
  
    try {
      const sizes = size
        .toUpperCase()
        .split(",")
        .map((s) => s.trim());
  
      // Prvo otpremi nove slike, ako postoje
      let imageUrls: string[] = product.images;
  
      if (images.length > 0) {
        imageUrls = await uploadImages();
      }
  
      // Ako su slike obrisane, obriši ih iz Firebase Storage
      if (removedImages.length > 0) {
        await Promise.all(
          removedImages.map(async (imageUrl) => {
            const filename = decodeURIComponent(
              imageUrl.split("/").pop()?.split("?")[0] || ""
            );
            const imageRef = ref(storage, `/${filename}`);
  
            await deleteObject(imageRef);
          })
        );
  
        imageUrls = imageUrls.filter((url) => !removedImages.includes(url));
      }
  
      // Update proizvoda u Firestore
      await updateDoc(doc(db, "products", product.productId), {
        name,
        type,
        manufacturer,
        gender,
        size: sizes,
        price: parseFloat(price),
        images: imageUrls,
        category,
        description,
      });
  
      toast.success("Proizvod uspešno izmenjen!");
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Greška prilikom izmene proizvoda. Pokušajte ponovo.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="edit-item-modal-container" onClick={onClose}>
      <form className="edit-item-form" onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
        <h2>Izmena proizvoda</h2> 

        <div className="edit-form-group">
          <label htmlFor="name">Naziv:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="edit-form-group">
          <label htmlFor="type">Tip:</label>
          <input
            id="type"
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          />
        </div>

        <div className="edit-form-group">
          <label htmlFor="category">Kategorija:</label>
          <input
            id="category"
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
        </div>

        <div className="edit-form-group">
          <label htmlFor="manufacturer">Proizvođač:</label>
          <input
            id="manufacturer"
            type="text"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            required
          />
        </div>

        <div className="edit-form-group">
          <label htmlFor="gender">Pol:</label>
          <select
            id="gender"
            value={gender}
            onChange={(e) => setGender(e.target.value as "male" | "female")}
            required
          >
            <option value="male">Muški</option>
            <option value="female">Ženski</option>
          </select>
        </div>

        <div className="edit-form-group">
          <label htmlFor="size">Veličine (odvojene zarezom):</label>
          <input
            id="size"
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            required
            pattern={sizePattern.source}
            title="Format: veličine odvojene zarezom"
          />
        </div>

        <div className="edit-form-group">
          <label htmlFor="price">Cena:</label>
          <input
            id="price"
            type="text"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
          />
        </div>

        <div className="edit-form-group">
          <label htmlFor="description">Opis:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        </div>

        <div className="edit-form-group">
          <label htmlFor="images">Slike:</label>
          <input
            id="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
          />
          <div className="image-previews">
            {imagePreviews.map((preview, index) => (
              <div className="image-preview-container" key={index}>
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="image-preview"
                />
                <span
                  className="remove-image-icon"
                  onClick={() => removeImage(index)}
                >
                  X
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="edit-button-wrapper">
          <button className="add-button" type="submit" disabled={loading}>
            {loading ? `Izmena ${Math.round(uploadProgress)}%` : "Izmeni proizvod"}
          </button>
          <button className="cancel-button" type="button" onClick={onClose}>
            Otkaži
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditItemModal;
