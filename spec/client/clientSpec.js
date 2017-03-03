describe("Client", function() {
  it("can create a key generator", function() {
    expect(function() {new KKSS.generator();}).not.toThrow();
  });

  describe("arithmetic over GF(q)", function() {
    describe("addition", function() {
      it("supports the identity", function() {
        expect(KKSS.add(0, 1)).toBe(1);
      });

      it("supports trivial cases", function() {
        expect(KKSS.add(1, 2)).toBe(3);
      });

      it("is supported if in GF(2^n)", function() {
        if (KKSS.order % 2 == 0) {
          expect(KKSS.add(1, 1)).toBe(0);
        }
      });

      it("is fully supported", function() {
        var order = KKSS.order;
        var generatedElements = new Array(order);
        var fieldAccumulator = 0;

        for (var i = 0; i < order; i++) {
          fieldAccumulator = KKSS.add(fieldAccumulator, 1);
          generatedElements[fieldAccumulator] = true;
        }

        for (var i = 0; i < order; i++) {
          expect(generatedElements[i]).toBe(true, i + " not generated");
        }
      });
    });

    describe("multiplication", function() {
      it("supports the identity", function() {
        expect(KKSS.multiply(1, 3)).toBe(3);
      });

      it("supports trivial cases", function() {
        expect(KKSS.multiply(3, 5)).toBe(15);
      });

      it("is supported if in GF(2^n)", function() {
        if (KKSS.order % 2 == 0) {
          expect(KKSS.multiply(1, 2)).toBe(0);
        }
      });
    });
  });

  describe("Generator", function() {
    beforeEach(function() {
      var mockRandom = {
        nextByte: function() {
          return 4
        }
      };

      this.subject = new KKSS.generator(mockRandom);
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

    describe("decompose", function() {
      beforeEach(function() {
        this.secret = "abcdefgh";
        this.n = 3;
        this.k = 2;
      });

      it("creates the correct number of parts", function() {
        var parts = this.subject.decompose(this.secret, this.k, this.n);
        expect(parts.length).toBe(this.n);
        for (var i = 0; i < this.n; i++) {
          expect(typeof parts[i]).toBe("string");
        }
      });

      it("creates the correct number of parts", function() {
        var parts = this.subject.decompose(this.secret, this.k, this.n);
      });
    });
  });
});
