// DateInput.tsx
import React, { ChangeEvent } from "react";

interface DateInputProps {
  date: string;
  setDate: (date: string) => void;
}

const DateInput: React.FC<DateInputProps> = ({ date, setDate }) => {
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  return (
    <div>
      <label htmlFor="date" className="block text-sm font-medium text-gray-700">
        Date et Heure de Début
      </label>
      <input
        type="datetime-local"
        id="date"
        value={date}
        onChange={handleDateChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      />
    </div>
  );
};

export default DateInput;
