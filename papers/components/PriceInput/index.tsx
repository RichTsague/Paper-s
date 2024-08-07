import React, { ChangeEvent } from "react";

interface PriceInputProps {
  price: string;
  setPrice: (value: string) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ price, setPrice }) => {
  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    // Validate input to ensure it's a number and within the desired range
    if (/^\d+$/.test(inputValue)) {
      const numericValue = parseInt(inputValue, 10);
      if (numericValue >= 0 && numericValue <= 10000) {
        setPrice(inputValue);
      }
    }
    // Optionally, you can provide user feedback if the input is invalid or out of range.
    // For simplicity, this example silently accepts valid inputs within the range.
  };

  return (
    <div>
      <label
        htmlFor="price"
        className="block text-sm font-medium text-gray-700"
      >
        Prix
      </label>
      <input
        type="text"
        id="price"
        value={price}
        onChange={handlePriceChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
};

export default PriceInput;
