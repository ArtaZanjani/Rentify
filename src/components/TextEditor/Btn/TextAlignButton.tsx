import type { Editor } from "@tiptap/react";
import type { TextAlign } from "@/components/tiptap-ui/text-align-button/use-text-align";
import ToggleButton from "./ToggleButton";
import { useTextAlign } from "@/components/tiptap-ui/text-align-button";

const TextAlignButton = ({ editor, align }: { editor: Editor | null; align: Exclude<TextAlign, "justify"> }) => {
  const { isVisible, isActive, canAlign, handleTextAlign, label, Icon } = useTextAlign({
    editor,
    align,
    hideWhenUnavailable: true,
  });

  return <ToggleButton editor={editor} isVisible={isVisible} isActive={isActive} canToggle={canAlign} onToggle={handleTextAlign} label={label} Icon={Icon} />;
};

export default TextAlignButton;
