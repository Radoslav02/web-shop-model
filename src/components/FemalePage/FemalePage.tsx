import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./FemalePage.css";
import { ScaleLoader } from "react-spinners";

type Product = {
  productId: string;
  name: string;
  price: number;
  images: string[];
};

export default function FemalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

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
      } catch (error) {
        console.error("Error fetching female products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFemaleProducts();
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
    <div className="female-page-container">
      {loading ? (
        <div className="loader">
          <ScaleLoader color="#1abc9c" />
        </div>
      ) : (
        <div className="female-products-grid">
          {products.map((product) => (
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
