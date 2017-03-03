"use strict";

// order options: 251, 256 (caveat: not implemented), 257

var KKSS = {};

KKSS.order = 251;

function boot() {
  console.log("booo!");
}

KKSS.add = function(a, b) {
  return (a+b) % KKSS.order;
};

KKSS.multiply = function(a, b) {
  return (a*b) % KKSS.order;
};

KKSS.generator = function() {
};

KKSS.generator.prototype.decompose = function(secret) {
  return ["test", "test", "test"];
};
