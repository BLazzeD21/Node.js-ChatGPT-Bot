export const textFormat = async (text) => {
  let output = text;

  output = output.replace(/!/g, "\\!");
  output = output.replace(/\./g, "\\!");
  output = output.replace(/_([^_]+)_/g, "<i>$1</i>");
  output = output.replace(/\*([^*]+)\*/g, "<b>$1</b>");
  return output;
};
