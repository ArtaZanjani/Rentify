import { useState } from "react";

type CheckBoxPropsType = {
  checked?: boolean;
  label: string | React.ReactNode;
  labelClassName?: string;
  className?: string;
  id?: string;
  onChange?: (checked: boolean) => void;
};

const CheckBox = ({ checked, label, className, labelClassName = "text-caption-lg text-g6", id, onChange }: CheckBoxPropsType) => {
  const [internalChecked, setInternalChecked] = useState<boolean>(checked ?? false);

  const isControlled = checked !== undefined && onChange;

  const handleChange = () => {
    if (isControlled) {
      const nextChecked = !checked;
      onChange?.(nextChecked);
    } else {
      setInternalChecked((prev) => {
        const nextChecked = !prev;
        onChange?.(nextChecked);
        return nextChecked;
      });
    }
  };

  return (
    <label className={`flex items-center gap-x-2 w-fit cursor-pointer ${className}`}>
      <div className="relative flex items-center">
        <input type="checkbox" checked={isControlled ? checked : internalChecked} onChange={handleChange} className="w-5 h-5 transition-all border-2 rounded shadow appearance-none cursor-pointer peer border-g6 active:border-primary checked:border-primary checked:bg-primary checked:border-slate-800" name={id} id={id} />
        <span className="absolute text-white transform -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none peer-checked:opacity-100 top-1/2 left-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </span>
      </div>

      <p className={`${labelClassName} translate-y-0.5`}>{label}</p>
    </label>
  );
};

export default CheckBox;
