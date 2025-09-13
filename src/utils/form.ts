import type { InputTypes } from "../types/types";
import { isPhoneNumber } from "./validation";

type InputRestriction = "just_number" | "just_text" | "any";

export const handleInputChange = (inputs: InputTypes[], setInputs: React.Dispatch<React.SetStateAction<InputTypes[]>>, name: string, value: string, restriction: InputRestriction) => {
  setInputs((prev) =>
    prev.map((input) => {
      if (input.name === name) {
        let newValue = value;

        if (restriction === "just_number") {
          newValue = newValue.replace(/\D/g, "");
        } else if (restriction === "just_text") {
          newValue = newValue.replace(/\d/g, "");
        }

        let error = "";

        if (newValue.length > 0 && input.type === "tel" && input.name === "phone_number") {
          if (!newValue.startsWith("0")) {
            error = "شماره تلفن باید با 0 شروع شود.";
          } else if (!isPhoneNumber(newValue)) {
            error = "شماره تلفن معتبر نیست.";
          }
        }

        return { ...input, value: newValue, error };
      }
      return input;
    })
  );
};

export const resetInputValue = (inputs: InputTypes[], setInputs: React.Dispatch<React.SetStateAction<InputTypes[]>>, name: string) => {
  setInputs((prev) => prev.map((input) => (input.name === name ? { ...input, value: "", error: "" } : input)));
};

export const areInputsValid = (inputs: InputTypes[]): boolean => {
  return inputs.every((e) => {
    if (e.DropDown) {
      return e.value.length > 0 && e.DropDown.some((item) => item.label === e.value) && !e.error;
    }
    return e.value.length > 0 && !e.error;
  });
};

export const normalize = (text: string) => text.replace(/ا/g, "آ");
