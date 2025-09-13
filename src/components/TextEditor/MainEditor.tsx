"use client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { useActionState, useEffect, useState } from "react";
import HeadingButton from "./Btn/HeadingButton";
import MarkButton from "./Btn/MarkButton";
import ListButton from "./Btn/ListButton";
import TextAlignButton from "./Btn/TextAlignButton";
import UndoRedoButton from "./Btn/UndoRedoButton";
import LinkButton from "./Btn/LinkButton";
import { Placeholder } from "@tiptap/extensions";
import { Swiper, SwiperSlide } from "swiper/react";
import InputsData from "./InputsData";
import { InputTypes } from "@/types/types";
import { NoteText, Subtitle } from "iconsax-react";
import BtnForm from "../auth/BtnForms";
import Heading from "@tiptap/extension-heading";
import { uploadBlog } from "@/actions/action_upload_blog";
import { toast } from "sonner";
import { validateBlog } from "@/utils/validation";

const MainEditor = () => {
  const [content, setContent] = useState<string>("");
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: { class: "list-disc mx-4" },
        },
        orderedList: {
          HTMLAttributes: { class: "list-decimal mx-4" },
        },
        heading: false,
      }),
      Heading.configure({
        levels: [2, 3, 4, 5, 6],
        HTMLAttributes: { class: "heading" },
      }),
      Highlight,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: "متن خود را وارد کنید",
      }),
    ],

    content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
    immediatelyRender: false,
  });

  const [inputs, setInputs] = useState<InputTypes[]>([
    {
      label: "عنوان",
      name: "title",
      id: "input_title",
      type: "text",
      icon: Subtitle,
      value: "",
      error: "",
    },
    {
      label: "توضیح کوتاه",
      name: "shortDesciption",
      id: "input_shortDesciption",
      type: "text",
      icon: NoteText,
      value: "",
      error: "",
    },
  ]);
  const [image, setImage] = useState<File | undefined>(undefined);

  const checkValue = inputs.every((e) => e.value.length && !e.error.length) && content.length > 7;

  const [stateCode, formActionCode] = useActionState(uploadBlog, {
    message: "",
    error: false,
  });

  useEffect(() => {
    if (stateCode.message.trim().length) {
      if (stateCode.error) {
        toast.error(stateCode.message);
      } else {
        toast.success(stateCode.message);
      }
    }
  }, [stateCode]);

  const newBlog = async () => {
    const validation = validateBlog(inputs[0].value, inputs[1].value, content, image);

    if (validation.error) {
      toast.error(validation.message);
      return;
    }

    const formData = new FormData();

    formData.append("title", inputs[0].value.trim());
    formData.append("shortDesciption", inputs[1].value.trim());
    formData.append("mainContent", content.trim());
    if (image) {
      formData.append("image", image);
    }

    await formActionCode(formData);
  };

  return (
    <form action={newBlog} className="mt-5 w-full">
      <InputsData inputs={inputs} setInputs={setInputs} setImage={setImage} />
      {/* Editor */}
      <div className="p-3 rounded-t-xl bg-g9/50 flex items-center gap-x-1 w-full mt-10" dir="ltr">
        <Swiper spaceBetween={3} slidesPerView="auto" className="!w-fit md!overflow-visible !mx-0">
          {(["undo", "redo"] as const).map((e) => (
            <SwiperSlide key={e} className="!w-fit">
              <UndoRedoButton editor={editor} action={e} />
            </SwiperSlide>
          ))}

          {([2, 3, 4, 5, 6] as const).map((level) => (
            <SwiperSlide key={level} className="!w-fit">
              <HeadingButton editor={editor} level={level} />
            </SwiperSlide>
          ))}

          {(["bold", "italic", "strike", "code", "underline", "superscript", "subscript"] as const).map((e) => (
            <SwiperSlide key={e} className="!w-fit">
              <MarkButton editor={editor} type={e} />
            </SwiperSlide>
          ))}

          {(["bulletList", "orderedList"] as const).map((e) => (
            <SwiperSlide key={e} className="!w-fit">
              <ListButton editor={editor} type={e} />
            </SwiperSlide>
          ))}

          {(["left", "center", "right"] as const).map((e) => (
            <SwiperSlide key={e} className="!w-fit">
              <TextAlignButton editor={editor} align={e} />
            </SwiperSlide>
          ))}
        </Swiper>

        <LinkButton editor={editor} openPopUp={openPopUp} setOpenPopUp={setOpenPopUp} />
      </div>
      <EditorContent dir="rtl" className="bg-white rounded-b-xl p-5" editor={editor} />
      <BtnForm label="ثبت بلاگ" check={checkValue} />
    </form>
  );
};

export default MainEditor;
