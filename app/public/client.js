(function() {
"use strict";

  // order options: 251, 256 (caveat: not implemented), 257

  var KKSS = window.KKSS = {};

  KKSS.order = 251;

  function boot() {
    console.log("booo!");
  };

  KKSS.limit = function(x) {
    var mod = x % KKSS.order;
    if (mod < 0) {
      mod += KKSS.order;
    }

    return mod;
  };

  KKSS.add = function(a, b) {
    return KKSS.limit(a+b);
  };

  KKSS.subtract = function(a, b) {
    return KKSS.limit(KKSS.limit(a)-KKSS.limit(b));
  };

  KKSS.multiply = function(a, b) {
    return KKSS.limit(a*b);
  };

  // https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
  KKSS.inverse = function(x) {
    if (x === 1) { return 1; }

    var ts = [0, 1],
        rs = [KKSS.order, x];

    while(rs[1] !== 0) {
      var q = Math.floor(rs[0] / rs[1]);
      ts = [ts[1], ts[0] - KKSS.multiply(q, ts[1])];
      rs = [rs[1], rs[0] - KKSS.multiply(q, rs[1])];
    }

    if (ts[0] < 0) {
      ts[0] = ts[0] + KKSS.order;
    }

    return ts[0];
  };

  KKSS.divide = function(numerator, denominator) {
    var inverse = KKSS.inverse(denominator);
    return KKSS.multiply(numerator, inverse);
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
      var term = KKSS.multiply(poly[i], Math.pow(x, i));
      y = KKSS.add(y, term);
    }

    return y;
  };

  KKSS.generator.prototype._decomposeByte = function(secret, k, pieceCount) {
    var poly = this.polynomial(secret.charCodeAt(0), k);
    var pieces = [];
    for (var i = 1; i <= pieceCount; i++) {
      pieces.push(pad(this.evaluate(poly, i), 3));
    }

    return pieces;
  };

  KKSS.generator.prototype.decompose = function(secret, k, pieceCount) {
    var secretPieces = new Array(pieceCount);
    for (var i = 0; i < pieceCount; i++) {
      secretPieces[i] = [i+1, ''];
    }

    for (var i = 0; i < secret.length; i++) {
      var bytePieces = this._decomposeByte(secret[i], k, pieceCount);
      for (var j = 0; j < pieceCount; j++) {
        secretPieces[j][1] += bytePieces[j];
      }
    }

    return secretPieces
  };

  KKSS.generator.prototype.reconstruct = function() {
    var parts = arguments;
    var secretAccumulator = 0;
    for (var j = 0; j < parts.length; j++) {
      var input_j = parts[j][0];
      var output_j = parseInt(parts[j][1]);

      var lagrangeAccumulator = 1;
      for (var m = 0; m < parts.length; m++) {
        if (m === j) { continue; }

        var input_m = parts[m][0];
        var term = KKSS.divide(input_m, KKSS.subtract(input_m, input_j));
        lagrangeAccumulator = KKSS.multiply(lagrangeAccumulator, term);
      }

      secretAccumulator = KKSS.add(secretAccumulator, KKSS.multiply(output_j, lagrangeAccumulator));
    }

    return String.fromCharCode(secretAccumulator);
  };

  function pad(str, length) {
    var s = str + '';
    while (s.length < length) {
      s = '0' + s;
    }

    return s;
  }
})();
