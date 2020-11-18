let gl = "";

const setVal = (value) => {
  gl = value;
};

const getVal = () => {
  return gl;
};

module.exports = {
  getVal,
  setVal,
};
