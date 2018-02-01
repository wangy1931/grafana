
export default {
  trim: (text) => {
    return text.toString().replace(/^\s+|\s+$/g, '');
  },
  lowercase: (str) => {
    return (typeof str === 'string') ? str.toLowerCase() : str;
  },
  indexOf: (array, searchElement) => {
    for (var i = 0, len = array.length; i < len; i++) {
      if (array[i] === searchElement) {
        return i;
      }
    }
    return -1;
  }
}
