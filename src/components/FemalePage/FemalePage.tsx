import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import "./FemalePage.css";
import { ScaleLoader } from "react-spinners";
import Filter from "../Filter/Filter"; 
import { useSelector } from 'react-redux'; // Import useSelector
import { RootState } from "../Redux/store"; // Import RootState

type Product = {
  productId: string;
  name: string;
  price: number;
  images: string[];
  gender: string; 
  type: string; 
  category: string; 
  size: string[]; 
};

export default function FemalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]); 
  const [filters, setFilters] = useState({
    types: [] as string[],
    categories: [] as string[],
    genders: [] as string[],
    sizes: [] as string[],
  });
  
  const navigate = useNavigate();
  const searchQuery = useSelector((state: RootState) => state.search.query); // Get the search query

  useEffect(() => {
    const fetchFemaleProducts = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "products"),
          where("gender", "==", "female")
        );

        const querySnapshot = await getDocs(q);
        const fetchedProducts: Product[] = querySnapshot.docs.map((doc) => ({
          productId: doc.id,
          ...doc.data(),
        })) as Product[];

        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); 
      } catch (error) {
        console.error("Error fetching female products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFemaleProducts();
  }, []);

  // Function to apply filters and search
  useEffect(() => {
    const applyFiltersAndSearch = () => {
      let updatedProducts = [...products];

      // Filter by search query
      if (searchQuery) {
        updatedProducts = updatedProducts.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply other filters
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

    applyFiltersAndSearch();
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
    <div className="female-page-container">
      <Filter onFilterChange={handleFilterChange} />
      
      {loading ? (
        <div className="loader">
          <ScaleLoader color="#1abc9c" />
        </div>
      ) : (
        <div className="female-products-grid">
          {filteredProducts.map((product) => (
            <div
              className="female-product-card"
              key={product.productId}
              onClick={() => handleProductClick(product.productId)} 
            >
              <img
                src={product.images[0]} 
                alt={product.name}
                className="female-product-image"
              />
              <h3 className="female-product-name">{product.name}</h3>
              <p className="female-product-price">{formatPrice(product.price)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
