describe("ViewController", function() {
  beforeEach(function() {
    this.dom = document.createElement("form");
    this.dom.innerHTML = '';
    this.dom.innerHTML += '<input name="secret"        type="text"   value="hello">';
    this.dom.innerHTML += '<input name="total-parts"   type="number" value="3">';
    this.dom.innerHTML += '<input name="minimum-parts" type="number" value="2">';
    this.dom.innerHTML += '<input name="generate-button" type="submit">';

    this.mockGenerator = {
      decompose: jasmine.createSpy('decompose').and.returnValue(140)
    };

    this.subject = new KKSS.viewController(this.dom, this.mockGenerator);
  });

  it("decomposes the secret when the submit button is clicked", function() {
    var evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });
    var button = this.dom.querySelector("[name=generate-button]");
    button.dispatchEvent(evt);

    expect(this.mockGenerator.decompose).toHaveBeenCalledWith("hello", 3, 2);
  });
});