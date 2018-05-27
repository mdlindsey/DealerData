'use strict';
module.exports = (input) => {
  input = typeof input !== "string"
      ? JSON.stringify(input)
      : input;

  try {
      input = JSON.parse(input);
  } catch (e) {
      return false;
  }

  if (typeof input === "object" && input !== null)
      return true;
  
  return false;
}
