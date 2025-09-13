import { useHeading } from "@/components/tiptap-ui/heading-button";
import type { Editor } from "@tiptap/react";
import ToggleButton from "./ToggleButton";

const HeadingButton = ({ editor, level }: { editor: Editor | null; level: 2 | 3 | 4 | 5 | 6 }) => {
  const { isVisible, isActive, canToggle, handleToggle, label, Icon } = useHeading({
    editor,
    level,
    hideWhenUnavailable: true,
  });

  return <ToggleButton editor={editor} isVisible={isVisible} isActive={isActive} canToggle={canToggle} onToggle={handleToggle} label={label} Icon={Icon} />;
};

export default HeadingButton;
