import { useMark } from "@/components/tiptap-ui/mark-button";
import type { Editor } from "@tiptap/react";
import type { Mark } from "@/components/tiptap-ui/mark-button/use-mark";
import ToggleButton from "./ToggleButton";

const MarkButton = ({ editor, type }: { editor: Editor | null; type: Mark }) => {
  const { isVisible, isActive, canToggle, handleMark, label, Icon } = useMark({
    editor,
    type,
    hideWhenUnavailable: true,
  });

  return <ToggleButton editor={editor} isVisible={isVisible} isActive={isActive} canToggle={canToggle} onToggle={handleMark} label={label} Icon={Icon} />;
};

export default MarkButton;
