import "./Sort.css"

interface SortProps {
  onSortChange: (sortBy: string) => void;
}

const Sort: React.FC<SortProps> = ({ onSortChange }) => {
  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(event.target.value);
  };

  return (
    <div className="sort-container">
      <label htmlFor="sort">Sortiraj: </label>
      <select id="sort" onChange={handleSortChange}>
        <option value="nameAsc">Naziv: A-Z</option>
        <option value="nameDesc">Naziv: Z-A</option>
        <option value="priceAsc">Cena: manja-veća</option>
        <option value="priceDesc">Cena: veća-manja</option>
      </select>
    </div>
  );
};

export default Sort;
