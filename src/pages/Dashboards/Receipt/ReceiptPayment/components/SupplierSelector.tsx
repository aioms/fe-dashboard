import React from "react";
import { SupplierSelect } from "Common/Components/Select/SupplierSelect";

interface SupplierSelectorProps {
  value: string | null;
  label?: string;
  onChange: (supplierId: string | null, supplierName: string) => void;
  disabled?: boolean;
}

export const SupplierSelector: React.FC<SupplierSelectorProps> = ({
  value,
  label = "",
  onChange,
  disabled = false,
}) => {
  const handleChange = (option: any) => {
    onChange(option?.value || null, option?.label || "");
  };

  const selectedOption = value ? { value, label } : null;

  return (
    <div>
      <label className="inline-block mb-2 text-base font-medium">
        Chọn nhà cung cấp <span className="text-red-500">*</span>
      </label>
      <SupplierSelect
        value={selectedOption}
        onChange={handleChange}
        isClearable={true}
        placeholder="Tìm kiếm và chọn nhà cung cấp"
      />
    </div>
  );
};
