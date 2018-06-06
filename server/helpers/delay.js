function delay(mili) {
  return new Promise(resolve => {
    setTimeout(resolve, mili);
  });
}

module.exports = delay;
