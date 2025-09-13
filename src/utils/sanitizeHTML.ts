import { JSDOM } from "jsdom";
import createDOMPurify from "dompurify";

export const sanitizeHTML = (html: string) => {
  const window = new JSDOM("").window;
  const DOMPurify = createDOMPurify(window);
  return DOMPurify.sanitize(html);
};
