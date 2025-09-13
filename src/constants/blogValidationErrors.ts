import { mongooseDuplicateError } from "@/utils/messages";

export const blogValidationErrors = {
  title: {
    required: "وارد کردن عنوان بلاگ الزامی است",
    minLength: "عنوان بلاگ باید حداقل 5 کاراکتر باشد",
    maxLength: "عنوان بلاگ نمی‌تواند بیشتر از 100 کاراکتر باشد",
  },
  shortDesciption: {
    required: "وارد کردن خلاصه بلاگ الزامی است",
    minLength: "خلاصه بلاگ باید حداقل 10 کاراکتر باشد",
    maxLength: "خلاصه بلاگ نمی‌تواند بیشتر از 200 کاراکتر باشد",
  },
  mainContent: {
    required: "وارد کردن محتوای بلاگ الزامی است",
  },
};

export const contactUsMessage = {
  name: mongooseDuplicateError.name,
  last_name: mongooseDuplicateError.last_name,
  phone_number: mongooseDuplicateError.phone_number,
  message: "وارد کردن پیام الزامی است",
};
