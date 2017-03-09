describe("ViewController", function() {
  beforeEach(function() {
    this.dom = document.createElement("div");
    this.dom.innerHTML = '<input id="generate-button" type="submit">';

    this.mockGenerator = {
      decompose: jasmine.createSpy('decompose').and.returnValue(140)
    };
  });

  it("decomposes the secret when the submit button is clicked", function() {
    var subject = new KKSS.viewController(this.dom, this.mockGenerator);
    this.dom.querySelector("#generate-button").onclick()
    expect(this.mockGenerator.decompose).toHaveBeenCalled();
  });
});