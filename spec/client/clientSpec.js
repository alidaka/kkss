describe("Client", function() {
  it("can create a key generator", function() {
    expect(function() {new KKSS.generator();}).not.toThrow();
  });
});
