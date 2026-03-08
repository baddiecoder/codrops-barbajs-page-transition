const select = (selector) => document.querySelector(selector);
const selectAll = (selector) => document.querySelectorAll(selector);

const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, "");

  if (hex.length === 3) {
    hex = hex
      .split("")
      .map((char) => char + char)
      .join("");
  }

  const bigint = parseInt(hex, 16);

  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return { r, g, b };
};

const setClassSplitText = (type) => {
  return type === "lines"
    ? {
        linesClass: "lines",
      }
    : type === "words"
      ? {
          wordsClass: "words",
        }
      : {
          charsClass: "chars",
        };
};

export { select, selectAll, hexToRgb, setClassSplitText };
