import type { Editor } from "@tiptap/react";
import type { UndoRedoAction } from "@/components/tiptap-ui/undo-redo-button/use-undo-redo";
import ToggleButton from "./ToggleButton";
import { useUndoRedo } from "@/components/tiptap-ui/undo-redo-button";

const UndoRedoButton = ({ editor, action }: { editor: Editor | null; action: UndoRedoAction }) => {
  const { canExecute, handleAction, label, Icon } = useUndoRedo({
    editor,
    action,
    hideWhenUnavailable: true,
  });

  return <ToggleButton editor={editor} isVisible={true} isActive={canExecute} canToggle={canExecute} onToggle={handleAction} label={label} Icon={Icon} />;
};

export default UndoRedoButton;
