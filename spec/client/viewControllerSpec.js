describe("ViewController", function() {
  beforeEach(function() {
    this.inputForm = document.createElement("form");
    this.inputForm.innerHTML = '';
    this.inputForm.innerHTML += '<input name="secret"        type="text"   value="hello">';
    this.inputForm.innerHTML += '<input name="total-parts"   type="number" value="3">';
    this.inputForm.innerHTML += '<input name="minimum-parts" type="number" value="2">';
    this.inputForm.innerHTML += '<input name="generate-button" type="submit">';

    this.outputDiv = document.createElement("div");

    this.mockGenerator = {
      decompose: jasmine.createSpy('decompose').and.returnValue([[1, "123123123"], [2, "123123124"], [3, "123123125"]])
    };

    this.subject = new KKSS.viewController(this.inputForm, this.outputDiv, this.mockGenerator);
  });

  it("decomposes the secret when the submit button is clicked", function() {
    var evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });
    var button = this.inputForm.querySelector("[name=generate-button]");
    button.dispatchEvent(evt);

    expect(this.mockGenerator.decompose).toHaveBeenCalledWith("hello", 2, 3);
  });

  it("prints out the result of decomposing the secret", function() {
    var evt = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      view: window
    });
    var button = this.inputForm.querySelector("[name=generate-button]");
    button.dispatchEvent(evt);

    expect(this.outputDiv.innerHTML).toContain("1-123123123");
    expect(this.outputDiv.innerHTML).toContain("2-123123124");
    expect(this.outputDiv.innerHTML).toContain("3-123123125");
  });
});