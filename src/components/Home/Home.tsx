import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useSelector } from 'react-redux';
import { RootState } from "../Redux/store"; // Import the RootState
import "./Home.css";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Filter from "../Filter/Filter";

type Product = {
  productId: string;
  name: string;
  price: number;
  images: string[];
  type: string;
  category: string;
  gender: string;
  size: string[];
};

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    types: [] as string[],
    categories: [] as string[],
    genders: [] as string[],
    sizes: [] as string[],
  });

  const searchQuery = useSelector((state: RootState) => state.search.query); // Get the search query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const q = collection(db, "products");
        const querySnapshot = await getDocs(q);
        const fetchedProducts: Product[] = querySnapshot.docs.map((doc) => ({
          productId: doc.id,
          ...doc.data(),
        })) as Product[];

        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      let updatedProducts = [...products];

      // Filter by search query
      if (searchQuery) {
        updatedProducts = updatedProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply other filters (types, categories, genders, sizes)
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

      setFilteredProducts(updatedProducts);
    };

    applyFilters();
  }, [filters, products, searchQuery]); // Include searchQuery as a dependency

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("sr-RS", {
      style: "currency",
      currency: "RSD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/proizvod/${productId}`);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="home-page-container">
      <Filter onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="loader">
          <ScaleLoader color="#1abc9c" />
        </div>
      ) : (
        <div className="home-products-grid">
          {filteredProducts.map((product) => (
            <div
              className="home-product-card"
              key={product.productId}
              onClick={() => handleProductClick(product.productId)}
            >
              <img
                src={product.images[0]}
                alt={product.name}
                className="home-product-image"
              />
              <h3 className="home-product-name">{product.name}</h3>
              <p className="home-product-price">{formatPrice(product.price)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
