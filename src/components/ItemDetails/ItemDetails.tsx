import { useEffect, useState } from "react";
import { db } from "../firebase";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import "./ItemDetails.css";

type Product = {
  productId: string;
  name: string;
  price: number;
  images: string[];
  description?: string;
  size?: string[];
  gender?: string;
};

export default function ItemDetails() {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isSizeSelected, setIsSizeSelected] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        if (!productId) {
          throw new Error("Product ID is undefined");
        }

        const docRef = doc(db, "products", productId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const productData = docSnap.data();

          if (productData) {
            const cleanedSizes = productData.size
              ? productData.size.map((size: string) => size.trim())
              : [];

            setProduct({
              productId: docSnap.id,
              name: productData.name,
              price: productData.price,
              images: productData.images || [],
              description: productData.description || "",
              size: cleanedSizes,
              gender: productData.gender || "",
            });

            setSelectedImage(productData.images ? productData.images[0] : null);
          } else {
            console.error("Product data is undefined.");
          }
        } else {
          console.error("No such document!");
        }
      } catch (error) {
        console.error("Error fetching product details: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("sr-RS", {
      style: "currency",
      currency: "RSD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleSizeChange = (size: string) => {
    setSelectedSize(size);
    setIsSizeSelected(true);
    setErrorMessage(null);
  };

  const handleAddToCart = () => {
    if (!isSizeSelected) {
      setErrorMessage("Odaberite veličinu");
    } else {
      console.log("Item added to cart with size:", selectedSize);
      setErrorMessage(null);
    }
  };

  return (
    <div className="item-details-container">
      {loading ? (
        <div className="loader">Loading...</div>
      ) : product ? (
        <div className="product-info">
          <div className="images-wrapper">
            <div className="thumbnail-container">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className={`thumbnail ${
                    selectedImage === image ? "selected" : ""
                  }`}
                  onClick={() => setSelectedImage(image)}
                />
              ))}
            </div>
            <div className="large-image-container">
              <img
                src={selectedImage || "placeholder-image-url.jpg"}
                alt={product.name}
                className="large-image"
              />
            </div>
          </div>
          <div className="details-container">
            <h1 className="details-product-name">{product.name}</h1>
            <p className="details-product-price">
              {formatPrice(product.price)}
            </p>

            <div className="details-item-sizes">
              <h4>Izaberite veličinu:</h4>
              {product.size && product.size.length > 0 ? (
                <div className="size-buttons">
                  {product.size.map((size) => (
                    <button
                      key={size}
                      className={`size-button ${
                        selectedSize === size ? "selected" : ""
                      }`}
                      onClick={() => handleSizeChange(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              ) : (
                <p>Nema dostupnih veličina</p>
              )}
            </div>

            <div className="button-message-wrapper">
              <button className="add-to-cart-button" onClick={handleAddToCart}>
                Dodaj u korpu
              </button>

              {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
            {product.description && (
              <p className="product-description">{product.description}</p>
            )}
          </div>
        </div>
      ) : (
        <p>Proizvod nije pronađen.</p>
      )}
    </div>
  );
}
