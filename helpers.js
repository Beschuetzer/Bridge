function capitalize(string) {
  try {
    return string.split(" ")
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  } catch (error) {
    console.error('error =', error);
  }
};
function objectLength (obj) {
  try {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  } catch (error) {
    console.error('error =', error);
  }
};
function flatten (array, depth) {
  try {
    depth = (depth == undefined) ? 1 : depth;
    return array.reduce(function (flat, toFlatten) {
      return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flatten(depth-1) : toFlatten);
    }, []);
  } catch (error) {
    console.error('error =', error);
  }
}

module.exports = {
  flatten,
  objectLength,
  capitalize,
}