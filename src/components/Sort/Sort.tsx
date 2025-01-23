import { useState } from "react";
import "./Sort.css";
import SortIcon from "@mui/icons-material/Sort";

interface SortProps {
  onSortChange: (sortBy: string) => void;
}

const Sort: React.FC<SortProps> = ({ onSortChange }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value);
  };

  return (
    <>
      <div className="sort-icon" id={drawerOpen ? 'active' : ''} onClick={() => setDrawerOpen(!drawerOpen)}>
        <SortIcon />
      </div>
      <div className={`drawer-content ${drawerOpen ? "open" : ""}`}>
        <div className="sort-container">
      
          <select id="sort" className="sort-select" onChange={handleSortChange}>
            <option value="nameAsc">Naziv: A-Z</option>
            <option value="nameDesc">Naziv: Z-A</option>
            <option value="priceAsc">Cena: manja-veća</option>
            <option value="priceDesc">Cena: veća-manja</option>
          </select>
        </div>
      </div>
    </>
  );
};

export default Sort;
