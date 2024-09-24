import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import "./AdminPanel.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddItemModal from "../Modals/NewItemModal";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import { ScaleLoader } from "react-spinners";
import EditItemModal from "../Modals/EditItemModal";

type Product = {
  productId: string;
  name: string;
  type: string;
  manufacturer: string;
  gender: "male" | "female";
  size: string[];
  price: number;
  images: string[];
};

export default function AdminPanel() {
  const [newItemClicked, setNewItemClicked] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number[]>([]);
  const [refreshProducts, setRefreshProducts] = useState<boolean>(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [editItemClicked, setEditItemClicked] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  function handleProductClick(product: Product) {
    setSelectedProduct(product);
    setEditItemClicked(true);
  }

  function handleNewItemClicked() {
    setNewItemClicked(true);
  }

  function handleCloseAddItemModal() {
    setNewItemClicked(false);
    setRefreshProducts(true);
  }

  function handleCloseEditItemModal() {
    setEditItemClicked(false);
    setSelectedProduct(null);
    setRefreshProducts(true); // Trigger refresh after closing the edit modal
  }

  const handleImageSelect = async (
    event: React.MouseEvent<HTMLButtonElement>, // Dodaj event kao parametar
    productIndex: number,
    imageIndex: number
  ) => {
    event.stopPropagation(); // Sprečava propagaciju događaja

    const product = products[productIndex];
    const newImages = [...product.images];
    const [selectedImage] = newImages.splice(imageIndex, 1);
    newImages.unshift(selectedImage);

    // Update local state
    const updatedProducts = [...products];
    updatedProducts[productIndex] = { ...product, images: newImages };
    setProducts(updatedProducts);
    setSelectedImageIndex(Array(updatedProducts.length).fill(0)); // Reset image selection

    // Update database
    const productDocRef = doc(db, "products", product.productId);
    await updateDoc(productDocRef, { images: newImages });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("sr-RS", {
      style: "currency",
      currency: "RSD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const deleteProduct = async (
    event: React.MouseEvent<SVGSVGElement>, // Dodaj event kao parametar
    productId: string,
    images: string[]
  ) => {
    event.stopPropagation(); // Sprečava propagaciju događaja

    try {
      setDeletingProductId(productId); // Set deletingProductId to indicate deletion in progress

      const productDocRef = doc(db, "products", productId);
      await deleteDoc(productDocRef);

      const deleteImagePromises = images.map((image) => {
        const imageRef = ref(storage, image);
        return deleteObject(imageRef);
      });
      await Promise.all(deleteImagePromises);

      setProducts(products.filter((product) => product.productId !== productId));
      console.log("Product and images deleted successfully.");
    } catch (error) {
      console.error("Error deleting product: ", error);
    } finally {
      setDeletingProductId(null);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "products");
        const productSnapshot = await getDocs(productsCollection);
        const productList = productSnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Product, "productId">;
          return { productId: doc.id, ...data };
        });
        setProducts(productList);
        setSelectedImageIndex(Array(productList.length).fill(0));
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
        setRefreshProducts(false);
      }
    };

    fetchProducts();
  }, [refreshProducts]);

  return (
    <div className="admin-panel-container">
      {newItemClicked && <AddItemModal onClose={handleCloseAddItemModal} />}
      {editItemClicked && selectedProduct && (
        <EditItemModal product={selectedProduct} onClose={handleCloseEditItemModal} />
      )}
      <div className="product-list">
        <div className="add-item-card" onClick={handleNewItemClicked}>
          <AddCircleIcon className="add-icon" sx={{ fontSize: 80 }} />
        </div>
        {loading ? (
          <div className="loader">
            <ScaleLoader color="#1abc9c" />
          </div>
        ) : products.length > 0 ? (
          products.map((product, index) => (
            <div key={product.productId} className="product-card" onClick={() => handleProductClick(product)}>
              <div className="product-image-container">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[selectedImageIndex[index]]}
                    alt={`Product image ${selectedImageIndex[index] + 1}`}
                    className="product-image"
                  />
                ) : (
                  <p>Nema dostupnih slika.</p>
                )}
              </div>
              <div className="image-selector">
                {product.images.map((_, imageIndex) => (
                  <button
                    key={imageIndex}
                    onClick={(event) => handleImageSelect(event, index, imageIndex)} // Dodaj event parametar
                    className={selectedImageIndex[index] === imageIndex ? "selected" : ""}
                  >
                    {imageIndex + 1}
                  </button>
                ))}
              </div>
              <Tooltip
                title={product.name}
                arrow
                placement="bottom"
                componentsProps={{
                  tooltip: {
                    sx: {
                      fontSize: "0.75rem",
                      bgcolor: "#fff",
                      color: "black",
                      p: 1,
                      border: "1px solid black",
                    },
                  },
                }}
              >
                <div className="item-title">{product.name}</div>
              </Tooltip>
              <div className="price-icon-wrapper">
                <p>{formatPrice(product.price)}</p>
                <DeleteIcon
                  onClick={(event) => !deletingProductId && deleteProduct(event, product.productId, product.images)} // Dodaj event parametar
                  className="delete-icon"
                  style={{
                    cursor: deletingProductId ? "not-allowed" : "pointer",
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p>Nema dostupnih proizvoda.</p>
        )}
      </div>
    </div>
  );
}
