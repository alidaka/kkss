"use strict";

// order options: 251, 256 (caveat: not implemented), 257

var KKSS = {};

KKSS.order = 251;

function boot() {
  console.log("booo!");
};

KKSS.add = function(a, b) {
  return (a+b) % KKSS.order;
};

KKSS.multiply = function(a, b) {
  return (a*b) % KKSS.order;
};

KKSS.generator = function(random) {
  this.random = random;
};

KKSS.generator.prototype.polynomial = function(secret, degree) {
  var poly = new Array(degree);
  poly[0] = secret;
  for (var i = 1; i < degree; i++) {
    poly[i] = this.random.nextByte(1);
  }

  return poly;
};

KKSS.generator.prototype.evaluate = function(poly, x) {
  var y = poly[0];
  for (var i = 1; i < poly.length; i++) {
    y += poly[i] * Math.pow(x, i);
  }

  return y;
};

KKSS.generator.prototype.decompose = function(secret) {
  return ["test", "test", "test"];
};
