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
      this.subject = new KKSS.generator();
    });

    it("", function() {
    });
  });
});
