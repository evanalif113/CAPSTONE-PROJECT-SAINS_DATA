// src/components/RangeSlider.tsx
"use client";

import * as Slider from "@radix-ui/react-slider";

interface RangeSliderProps {
  label: string; //label untuk slider
  value: [number, number]; // Array dengan dua nilai: [min, max]
  onChange: (newValue: [number, number]) => void;
  min: number;
  max: number;
  step?: number;
  unit: string;
  colorClassName: string; // Kelas warna untuk trek, misal: "bg-blue-500"
}

export const RangeSlider = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  unit,
  colorClassName,
}: RangeSliderProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="text-sm font-semibold text-gray-900 bg-gray-100 px-2 py-1 rounded">
          {value[0]} {unit} - {value[1]} {unit}
        </div>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={value}
        onValueChange={onChange} // onValueChange mengembalikan [min, max]
        min={min}
        max={max}
        step={step}
        minStepsBetweenThumbs={1}
      >
        {/* Trek Latar Belakang */}
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-[6px]">
          {/* Trek Berwarna (di antara dua gagang) */}
          <Slider.Range
            className={`absolute rounded-full h-full ${colorClassName}`}
          />
        </Slider.Track>
        
        {/* Gagang/Thumb untuk Nilai Minimum */}
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          aria-label="Minimum Value"
        />
        {/* Gagang/Thumb untuk Nilai Maksimum */}
        <Slider.Thumb
          className="block w-5 h-5 bg-white shadow-md rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
          aria-label="Maximum Value"
        />
      </Slider.Root>
    </div>
  );
};