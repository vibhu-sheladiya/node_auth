const pick = (object, keys) => {
  console.log("🚀 ~ file: pick.js:2 ~ pick ~ pick:", pick);
  return keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      console.log("🚀 ~ file: pick.js:4 ~ returnkeys.reduce ~ object:", object);
      obj[key] = object[key];
    }
    console.log(
      "🚀 ~ file: pick.js:8 ~ returnkeys.reduce ~ obj[key]:",
      obj[key]
    );
    return obj;
  }, {});
};
module.exports = pick;
