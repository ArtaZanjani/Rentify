type SwitchType = {
  checked: boolean;
  onChange: () => void;
};

const Switch = ({ checked, onChange }: SwitchType) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} className="sr-only peer" onChange={onChange} />
      <div className="relative w-11 h-6 bg-gray-200 rounded-full bg-g8 peer-checked:bg-primary transition-all peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  );
};

export default Switch;
