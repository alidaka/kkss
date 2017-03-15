(function() {
"use strict";

  var KKSS = window.KKSS = {};

  KKSS.characteristic = 2;
  KKSS.dimension = 8;
  KKSS.order = Math.pow(KKSS.characteristic, KKSS.dimension);
  KKSS.byteLength = Math.ceil(Math.log(KKSS.order)/Math.log(10));
  KKSS.irreduciblePolynomial = 283;
  KKSS.irreduciblePolynomialMinusHighestOrderTerm = KKSS.irreduciblePolynomial - KKSS.order;

  KKSS.boot = function() {
    KKSS._generator = new KKSS.generator(new KKSS.random());

    var formRoot = document.getElementById("input-form");
    var outputRoot = document.getElementById("partial-keys");
    KKSS._viewController = KKSS.createViewController(formRoot, outputRoot, KKSS._generator);
  };

  KKSS.add = function(a, b) {
    return a ^ b;
  };

  KKSS.subtract = function(a, b) {
    return a ^ b;
  };

  KKSS.multiply = function(multiplier, multiplicand) {
    var candidate = multiplicand;
    var total = 0;
    for (var i = 0; i < KKSS.dimension; i++) {
      if (multiplier === 0 || candidate === 0) { break; }
      var multiplierLowBitSet = (multiplier & 1) === 1;
      if (multiplierLowBitSet) {
        total = KKSS.add(total, candidate);
      }

      multiplier = multiplier >> 1;

      var carry = (candidate & 128) === 128;
      candidate = candidate << 1;
      if (carry) {
        candidate = candidate ^ 256;
        candidate = KKSS.add(candidate, KKSS.irreduciblePolynomialMinusHighestOrderTerm);
      }
    }

    return total;
  };

  KKSS.pow = function(base, exponent) {
    var accumulator = 1;
    for (var i = 0; i < exponent; i++) {
      accumulator = KKSS.multiply(accumulator, base);
    }

    return accumulator;
  };

  // TODO: consider a more efficient approach, e.g.:
  // https://en.wikipedia.org/wiki/Extended_Euclidean_algorithm
  KKSS.inverse = function(x) {
    var accumulator = 1;
    for (var i = 0; i < KKSS.order - 2; i++) {
      accumulator = KKSS.multiply(accumulator, x);
    }

    return accumulator;
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

  // https://en.wikipedia.org/wiki/Horner's_method
  KKSS.generator.prototype.evaluate = function(poly, x) {
    var degree = poly.length - 1;

    var out = poly[degree];
    for (var i = degree - 1; i >= 0; i--){
      out = KKSS.add(KKSS.multiply(out, x), poly[i]);
    }

    return out;
  };

  KKSS.generator.prototype._decomposeByte = function(secret, k, pieceCount) {
    var poly = this.polynomial(secret.charCodeAt(0), k);
    var pieces = [];
    for (var i = 1; i <= pieceCount; i++) {
      pieces.push(pad(this.evaluate(poly, i)));
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

    return secretPieces;
  };

  KKSS.generator.prototype._reconstructByte = function(pieces) {
    var secretAccumulator = 0;
    for (var j = 0; j < pieces.length; j++) {
      var input_j = pieces[j][0];
      var output_j = parseInt(pieces[j][1]);

      var lagrangeAccumulator = 1;
      for (var m = 0; m < pieces.length; m++) {
        if (m === j) { continue; }

        var input_m = pieces[m][0];
        var term = KKSS.divide(input_m, KKSS.subtract(input_m, input_j));
        lagrangeAccumulator = KKSS.multiply(lagrangeAccumulator, term);
      }

      secretAccumulator = KKSS.add(secretAccumulator, KKSS.multiply(output_j, lagrangeAccumulator));
    }

    return String.fromCharCode(secretAccumulator);
  };

  KKSS.generator.prototype.reconstruct = function() {
    var pieces = arguments;
    var byteComponents = pieces[0][1].length / KKSS.byteLength;
    var secretAccumulator = [];

    for (var i = 0; i < byteComponents; i++) {
      var byteParts = new Array(pieces.length);
      for (var keyPiece = 0; keyPiece < pieces.length; keyPiece++) {
        var pieceInput = pieces[keyPiece][0];
        var pieceOutput = pieces[keyPiece][1].substr(KKSS.byteLength * i, KKSS.byteLength);
        byteParts[keyPiece] = [pieceInput, pieceOutput];
      }

      secretAccumulator.push(this._reconstructByte(byteParts));
    }

    return secretAccumulator.join('');
  };

  function pad(str) {
    var s = str + '';
    while (s.length < KKSS.byteLength) {
      s = '0' + s;
    }

    return s;
  }
})();
