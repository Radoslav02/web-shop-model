import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import "./Filter.css";

type FilterProps = {
  onFilterChange: (filters: any) => void;
};

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [types, setTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [genders, setGenders] = useState<string[]>([]);
  const [sizes, setSizes] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState({
    types: [] as string[],
    categories: [] as string[],
    genders: [] as string[],
    sizes: [] as string[],
  });

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const q = collection(db, "products");
        const querySnapshot = await getDocs(q);
        const fetchedTypes = new Set<string>();
        const fetchedCategories = new Set<string>();
        const fetchedGenders = new Set<string>();
        const fetchedSizes = new Set<string>();

        querySnapshot.forEach((doc) => {
          const product = doc.data();
          if (product.type) fetchedTypes.add(product.type);
          if (product.category) fetchedCategories.add(product.category);
          if (product.gender) fetchedGenders.add(product.gender);
          
          // Handle size based on its type
          if (Array.isArray(product.size)) {
            product.size.forEach((size: string) => {
              fetchedSizes.add(size.trim());
            });
          }
        });

        setTypes(Array.from(fetchedTypes));
        setCategories(Array.from(fetchedCategories));
        setGenders(Array.from(fetchedGenders));
        setSizes(Array.from(fetchedSizes));
      } catch (error) {
        console.error("Error fetching filter data: ", error);
      }
    };

    fetchFilterData();
  }, []);

  const handleCheckboxChange = (
    filterType: keyof typeof selectedFilters,
    value: string
  ) => {
    setSelectedFilters((prev) => {
      const updatedFilter = prev[filterType].includes(value)
        ? prev[filterType].filter((item) => item !== value)
        : [...prev[filterType], value];

      const newFilters = { ...prev, [filterType]: updatedFilter };
      
      onFilterChange(newFilters);

      return newFilters;
    });
  };

  return (
    <div className="filter-container">
      <div className="filter-form">
        <h3>Tip:</h3>
        {types.map((type, index) => (
          <div className="filter-inputs" key={`${type}-${index}`}>
            <input
              className="checkbox-input"
              type="checkbox"
              value={type}
              onChange={() => handleCheckboxChange("types", type)}
            />
            <label>{type}</label>
          </div>
        ))}
      </div>
      <div className="filter-form">
        <h3>Kategorija:</h3>
        {categories.map((category, index) => (
          <div className="filter-inputs" key={`${category}-${index}`}>
            <input
              className="checkbox-input"
              type="checkbox"
              value={category}
              onChange={() => handleCheckboxChange("categories", category)}
            />
            <label>{category}</label>
          </div>
        ))}
      </div>
      <div className="filter-form">
        <h3>Pol:</h3>
        {genders.map((gender, index) => (
          <div className="filter-inputs" key={`${gender}-${index}`}>
            <input
              className="checkbox-input"
              type="checkbox"
              value={gender}
              onChange={() => handleCheckboxChange("genders", gender)}
            />
            <label>
              {gender === "male" ? "Muškarci" : gender === "female" ? "Žene" : gender}
            </label>
          </div>
        ))}
      </div>
      <div className="filter-form">
        <h3>Veličina:</h3>
        {sizes.map((size, index) => (
          <div className="filter-inputs" key={`${size}-${index}`}>
            <input
              className="checkbox-input"
              type="checkbox"
              value={size}
              onChange={() => handleCheckboxChange("sizes", size)}
            />
            <label>{size}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Filter;
