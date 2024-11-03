import { useEffect, useState } from "react";
import { db, storage } from "../firebase";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import "./AdminPanel.css";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddItemModal from "../Modals/NewItemModal";
import DeleteIcon from "@mui/icons-material/Delete";
import Tooltip from "@mui/material/Tooltip";
import { ScaleLoader } from "react-spinners";
import EditItemModal from "../Modals/EditItemModal";
import Filter from "../Filter/Filter"; // Import the Filter component
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import Sort from "../Sort/Sort"; // Import the Sort component

type Product = {
  productId: string;
  name: string;
  type: string;
  category: string;
  manufacturer: string;
  gender: "male" | "female";
  size: string[];
  price: number;
  images: string[];
  description: string;
};

export default function AdminPanel() {
  const [newItemClicked, setNewItemClicked] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number[]>([]);
  const [refreshProducts, setRefreshProducts] = useState<boolean>(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [editItemClicked, setEditItemClicked] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filters, setFilters] = useState({
    types: [] as string[],
    categories: [] as string[],
    genders: [] as string[],
    sizes: [] as string[],
  });
  const [sortBy, setSortBy] = useState<string>("nameAsc"); // State to store the selected sorting option

  const searchQuery = useSelector((state: RootState) => state.search.query); // Search query from Redux store

  const handleNewItemClicked = () => {
    setNewItemClicked(true);
  };

  const handleCloseAddItemModal = () => {
    setNewItemClicked(false);
    setRefreshProducts(true);
  };

  const handleCloseEditItemModal = () => {
    setEditItemClicked(false);
    setSelectedProduct(null);
    setRefreshProducts(true);
  };

  const handleImageSelect = async (productIndex: number, imageIndex: number) => {
    const updatedSelectedImageIndex = [...selectedImageIndex];
    updatedSelectedImageIndex[productIndex] = imageIndex;
    setSelectedImageIndex(updatedSelectedImageIndex);

    const selectedProductId = filteredProducts[productIndex].productId;
    const newImages = [...filteredProducts[productIndex].images];
    const selectedImage = newImages.splice(imageIndex, 1)[0];
    newImages.unshift(selectedImage);

    try {
      const productRef = doc(db, "products", selectedProductId);
      await updateDoc(productRef, { images: newImages });
      console.log("Product images updated successfully.");
    } catch (error) {
      console.error("Error updating product images: ", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("sr-RS", {
      style: "currency",
      currency: "RSD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const deleteProduct = async (event: React.MouseEvent<SVGSVGElement>, productId: string, images: string[]) => {
    event.stopPropagation();

    try {
      setDeletingProductId(productId);
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
        setFilteredProducts(productList); // Initially show all products
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

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  const handleSortChange = (sortBy: string) => {
    setSortBy(sortBy);
  };

  useEffect(() => {
    const applyFiltersAndSearch = () => {
      let updatedProducts = [...products];

      // Apply search filter
      if (searchQuery) {
        updatedProducts = updatedProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply additional filters
      if (filters.types.length > 0) {
        updatedProducts = updatedProducts.filter((product) =>
          filters.types.includes(product.type)
        );
      }

      if (filters.categories.length > 0) {
        updatedProducts = updatedProducts.filter((product) =>
          filters.categories.includes(product.category)
        );
      }

      if (filters.genders.length > 0) {
        updatedProducts = updatedProducts.filter((product) =>
          filters.genders.includes(product.gender)
        );
      }

      if (filters.sizes.length > 0) {
        updatedProducts = updatedProducts.filter((product) =>
          product.size.some((size) => filters.sizes.includes(size))
        );
      }

      // Apply sorting
      if (sortBy === "nameAsc") {
        updatedProducts.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortBy === "nameDesc") {
        updatedProducts.sort((a, b) => b.name.localeCompare(a.name));
      } else if (sortBy === "priceAsc") {
        updatedProducts.sort((a, b) => a.price - b.price);
      } else if (sortBy === "priceDesc") {
        updatedProducts.sort((a, b) => b.price - a.price);
      }

      setFilteredProducts(updatedProducts);
    };

    applyFiltersAndSearch();
  }, [filters, products, searchQuery, sortBy]);

  const handleEditItemClick = (product: Product) => {
    setSelectedProduct(product);
    setEditItemClicked(true);
  };

  return (
    <div className="admin-panel-container">
      {newItemClicked && <AddItemModal onClose={handleCloseAddItemModal} />}
      {editItemClicked && selectedProduct && (
        <EditItemModal product={selectedProduct} onClose={handleCloseEditItemModal} />
      )}
      <Filter onFilterChange={handleFilterChange} />
      <Sort onSortChange={handleSortChange} /> {/* Add Sort Component */}
      <div className="product-list">
        <div className="add-item-card" onClick={handleNewItemClicked}>
          <AddCircleIcon className="add-icon" sx={{ fontSize: 80 }} />
        </div>
        {loading ? (
          <div className="loader">
            <ScaleLoader color="#1abc9c" />
          </div>
        ) : filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div key={product.productId} className="product-card" onClick={() => handleEditItemClick(product)}>
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
                    onClick={(event) => {
                      event.stopPropagation();
                      handleImageSelect(index, imageIndex);
                    }}
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
                  onClick={(event) => !deletingProductId && deleteProduct(event, product.productId, product.images)}
                  className="delete-icon"
                  style={{
                    cursor: deletingProductId ? "not-allowed" : "pointer",
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p>Nema proizvoda za prikaz.</p>
        )}
      </div>
    </div>
  );
}
