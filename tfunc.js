const x = "hello";

function y(x) {
  return x;
}

module.exports.init = function() {
  console.log(y(x));
};
