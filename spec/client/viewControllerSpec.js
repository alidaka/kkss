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

    this.submitForm = function() {
      var button = this.inputForm.querySelector("[name=generate-button]");

      var evt;
      try {
        evt = new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window
        });
      } catch (e) {
        // workaround for phantomjs :(
        evt = document.createEvent("MouseEvent");
        evt.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
      }

      button.dispatchEvent(evt);
    };
  });

  it("decomposes the secret when the submit button is clicked", function() {
    this.submitForm();
    expect(this.mockGenerator.decompose).toHaveBeenCalledWith("hello", 2, 3);
  });

  it("prints out the result of decomposing the secret", function() {
    this.submitForm();
    expect(this.outputDiv.innerHTML).toContain("2-1-123123123");
    expect(this.outputDiv.innerHTML).toContain("2-2-123123124");
    expect(this.outputDiv.innerHTML).toContain("2-3-123123125");
  });

  it("replaces partial displays from previous calls", function() {
    var staleContent = document.createElement("ul");
    this.outputDiv.appendChild(staleContent);

    this.submitForm();
    expect(this.outputDiv.children).not.toContain(staleContent);
  });
});
