"use strict";

KKSS.random = function() {
};

KKSS.random.prototype.nextByte = function() {
  return Math.floor(Math.random() * (255)) + 1;
};
