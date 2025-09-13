import type { Editor } from "@tiptap/react";
import { type ListType, useList } from "@/components/tiptap-ui/list-button/use-list";
import ToggleButton from "./ToggleButton";

const ListButton = ({ editor, type }: { editor: Editor | null; type: Exclude<ListType, "taskList"> }) => {
  const { isVisible, isActive, canToggle, handleToggle, label, Icon } = useList({
    editor,
    type,
    hideWhenUnavailable: true,
  });

  return <ToggleButton editor={editor} isVisible={isVisible} isActive={isActive} canToggle={canToggle} onToggle={handleToggle} label={label} Icon={Icon} />;
};

export default ListButton;
