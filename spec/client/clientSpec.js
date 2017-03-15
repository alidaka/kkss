describe("Client", function() {
  it("can create a key generator", function() {
    expect(function() {new KKSS.generator();}).not.toThrow();
  });

  describe("arithmetic over GF(q)", function() {
    describe("addition", function() {
      it("supports the identity", function() {
        expect(KKSS.add(0, 1)).toBe(1);
      });

      it("supports a trivial case exhaustively", function() {
        expect(KKSS.add(1, 2)).toBe(3);
        expect(KKSS.add(2, 1)).toBe(3);
        expect(KKSS.add(1, 3)).toBe(2);
        expect(KKSS.add(3, 1)).toBe(2);
        expect(KKSS.add(2, 3)).toBe(1);
        expect(KKSS.add(3, 2)).toBe(1);
      });

      it("is supported if in GF(2^n)", function() {
        expect(KKSS.add(1, 1)).toBe(0);
        expect(KKSS.add(250, 250)).toBe(0);
      });
    });

    describe("subtraction", function() {
      it("supports the identity", function() {
        expect(KKSS.subtract(1, 0)).toEqual(1);
      });

      it("supports a trivial case exhaustively", function() {
        expect(KKSS.subtract(1, 2)).toBe(3);
        expect(KKSS.subtract(2, 1)).toBe(3);
        expect(KKSS.subtract(1, 3)).toBe(2);
        expect(KKSS.subtract(3, 1)).toBe(2);
        expect(KKSS.subtract(2, 3)).toBe(1);
        expect(KKSS.subtract(3, 2)).toBe(1);
      });
    });

    describe("multiplication", function() {
      it("supports the identity", function() {
        expect(KKSS.multiply(1, 3)).toBe(3);
        expect(KKSS.multiply(158, 1)).toBe(158);
      });

      it("supports trivial cases", function() {
        expect(KKSS.multiply(3, 5)).toBe(15);
        expect(KKSS.multiply(5, 3)).toBe(15);
      });

      it("supports more complex cases", function() {
        expect(KKSS.multiply(15, 3)).toBe(17);
        expect(KKSS.multiply(255, 3)).toBe(26);
        expect(KKSS.multiply(15, 15)).toBe(85);
      });

      it("has a generator", function() {
        var order = KKSS.order;
        var generatedElements = new Array(order);
        var generator = 3;
        var fieldAccumulator = 1;

        for (var i = 0; i < order; i++) {
          fieldAccumulator = KKSS.multiply(fieldAccumulator, generator);
          generatedElements[fieldAccumulator] = true;
        }

        for (var i = 1; i < order; i++) {
          expect(generatedElements[i]).toEqualWithMessage(true, i + " not generated");
        }
      });
    });

    describe("division", function() {
      it("supports the identity", function() {
        expect(KKSS.divide(123, 1)).toEqual(123);
      });

      it("supports a trivial case", function() {
        expect(KKSS.divide(85, 3)).toEqual(51);
      });

      it("has some sanity checks", function() {
        expect(KKSS.divide(26, 3)).toEqual(255);
      });
    });

    describe("inverse", function() {
      it("calculates a multiplicative inverse", function() {
        expect(KKSS.inverse(141)).toBe(2);
      });

      it("handles the multiplicative identity, 1", function() {
        expect(KKSS.inverse(1)).toEqual(1);
      });

      it("has inverses that multiply by to 1", function() {
        expect(KKSS.multiply(2, KKSS.inverse(2))).toEqual(1);
        expect(KKSS.multiply(3, KKSS.inverse(3))).toEqual(1);
        expect(KKSS.multiply(126, KKSS.inverse(126))).toEqual(1);
        expect(KKSS.multiply(250, KKSS.inverse(250))).toEqual(1);
      });
    });
  });

  describe("Generator", function() {
    beforeEach(function() {
      this.mockRandom = {
        nextByte: jasmine.createSpy('nextByte').and.returnValue(140)
      };

      this.subject = new KKSS.generator(this.mockRandom);
    });

    describe("polynomial", function() {
      it("generates a representative polynomial of expected degree", function() {
        var degree = 5;
        var poly = this.subject.polynomial(123, degree);
        expect(poly.length).toBe(degree);
      });

      it("uses the secret as the constant coefficient", function() {
        var secret = 123;
        var poly = this.subject.polynomial(secret, 5);
        expect(poly[0]).toBe(secret);
      });
    });

    it("evaluates polynomials", function() {
      var poly = [1, 2, 3];
      expect(this.subject.evaluate(poly, 2)).toBe(9);
    });

    it("operates within the field", function() {
      var poly = [1, 2];
      expect(this.subject.evaluate(poly, 250)).toBe(238);
    });

    describe("decomposition", function() {
      beforeEach(function() {
        this.n = 3;
        this.k = 2;
      });

      it("decomposes a single byte", function() {
        var parts = this.subject.decompose('a', this.k, this.n);
        expect(parts).toEqual([[1, "237"], [2, "098"], [3, "238"]]);
      });

      it("decomposes a multibyte string", function() {
        var parts = this.subject.decompose('aaa', this.k, this.n);
        expect(parts).toEqual([[1, "237237237"], [2, "098098098"], [3, "238238238"]]);
      });

      it("uses new polynomials for each byte", function() {
        this.mockRandom.nextByte.and.returnValues(140, 6, 123, 209);

        var parts = this.subject.decompose('abba', this.k, this.n);
        expect(parts).toEqual([[1, "237100025176"], [2, "098110148216"], [3, "238104239009"]]);
      });
    });

    describe("reconstruction", function() {
      it("reconstructs single byte secrets", function() {
        var aParts = [[1, "237"], [2, "098"], [3, "238"]];
        expect(this.subject.reconstruct(aParts[0], aParts[1])).toEqual('a');
        expect(this.subject.reconstruct(aParts[0], aParts[2])).toEqual('a');
        expect(this.subject.reconstruct(aParts[2], aParts[1])).toEqual('a');

        var bParts = [[1, "100"], [2, "110"], [3, "104"]];
        expect(this.subject.reconstruct(bParts[0], bParts[1])).toEqual('b');
        expect(this.subject.reconstruct(bParts[0], bParts[2])).toEqual('b');
        expect(this.subject.reconstruct(bParts[2], bParts[1])).toEqual('b');
      });

      it("reconstructs single byte secrets from many pieces", function() {
        var parts = [[1, '047'], [2, '005'], [3, '160']];
        expect(this.subject.reconstruct(parts[0], parts[1], parts[2])).toEqual('a');
      });

      it("reconstructs multi-byte secrets", function() {
        var parts = [[1, "237104221055"], [2, "126110093013"]];
        expect(this.subject.reconstruct(parts[0], parts[1])).toEqual("abba");
      });
    });
  });
});
