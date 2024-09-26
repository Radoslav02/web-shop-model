import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "./MalePage.css";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

type Product = {
  productId: string;
  name: string;
  price: number;
  images: string[];
};

export default function MalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaleProducts = async () => {
      setLoading(true);
      try {
        // Reference to the products collection
        const q = query(
          collection(db, "products"),
          where("gender", "==", "male")
        );

        // Fetch products
        const querySnapshot = await getDocs(q);
        const fetchedProducts: Product[] = querySnapshot.docs.map((doc) => ({
          productId: doc.id,
          ...doc.data(),
        })) as Product[];

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching male products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaleProducts();
  }, []);

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

  return (
    <div className="male-page-container">
      {loading ? (
         <div className="loader">
         <ScaleLoader color="#1abc9c" />
       </div>
      ) : (
        <div className="male-products-grid">
          {products.map((product) => (
            <div className="male-product-card" key={product.productId}
            onClick={() => handleProductClick(product.productId)} >
              <img
                src={product.images[0]} 
                alt={product.name}
                className="male-product-image"
              />
              <h3 className="male-product-name">{product.name}</h3>
              <p className="fdemale-product-price">{formatPrice(product.price)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
