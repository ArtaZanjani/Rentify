import type { Editor } from "@tiptap/react";

type ToggleButtonProps = {
  editor: Editor | null;
  isVisible: boolean;
  isActive: boolean;
  canToggle: boolean;
  onToggle: () => void;
  label?: string;
  Icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};

const ToggleButton = ({ editor, isVisible, isActive, canToggle, onToggle, label, Icon }: ToggleButtonProps) => {
  if (!editor || !isVisible) return null;
  return (
    <button type="button" className={`size-9 relative flex items-center justify-center ${canToggle ? "group" : "opacity-50 cursor-not-allowed"}`} onClick={onToggle} disabled={!canToggle} aria-label={label} aria-pressed={isActive}>
      {Icon && <Icon className="size-4" />}

      <div className={`absolute top-1/2 left-1/2 -translate-1/2 bg-black/20 size-full duration-200 rounded-full ${isActive ? "scale-100" : "scale-0 group-hover:scale-100"}`}></div>
    </button>
  );
};

export default ToggleButton;
