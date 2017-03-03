describe("Random", function() {
  beforeEach(function() {
    this.subject = new KKSS.random();
  });

  it("generates numbers", function() {
    var x = this.subject.nextByte();
    expect(typeof x).toBe("number");
  });

  it("generates numbers which appear to be integral", function() {
    for (var i = 0; i < 100; i++) {
      var x = this.subject.nextByte();
      expect(x).toBe(Math.floor(x));
    }
  });

  it("falls within 8 bits of size", function() {
    for (var i = 0; i < 100; i++) {
      var x = this.subject.nextByte();
      expect(x).toBeLessThan(256);
    }
  });

  it("does not return 0", function() {
    for (var i = 0; i < 100; i++) {
      var x = this.subject.nextByte();
      expect(x).toBeGreaterThan(0);
    }
  });
});
