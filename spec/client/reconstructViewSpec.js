describe("reconstructView", function() {
  beforeEach(function() {
    this.inputForm = document.createElement("form");
    this.inputForm.innerHTML = '';
    this.inputForm.innerHTML += '<input name="key0" class="partial-key" type="text"   value="2-1-123123123">';
    this.inputForm.innerHTML += '<input name="key1" class="partial-key" type="text"   value="2-2-123123124">';
    this.inputForm.innerHTML += '<input name="reconstruct-button" type="submit">';

    this.outputDiv = document.createElement("div");

    this.mockGenerator = {
      reconstruct: jasmine.createSpy('reconstruct').and.returnValue("hello")
    };

    this.subject = new KKSS.reconstructView(this.inputForm, this.outputDiv, this.mockGenerator);
  });

  it("reconstructs the secret when the submit button is clicked", function() {
    this.submitForm("reconstruct-button");
    expect(this.mockGenerator.reconstruct).toHaveBeenCalledWith([1, "123123123"], [2, "123123124"]);
  });

  it("reconstructs the secret from an arbitrary number of pieces", function() {
    this.inputForm.innerHTML += '<input name="key2" class="partial-key" type="text"   value="2-3-123123125">';
    this.inputForm.innerHTML += '<input name="key3" class="partial-key" type="text"   value="2-4-123123126">';
    this.submitForm("reconstruct-button");

    expect(this.mockGenerator.reconstruct)
      .toHaveBeenCalledWith([1, "123123123"], [2, "123123124"], [3, "123123125"], [4, "123123126"]);
  });

  it("ignores empty key fields", function() {
    this.inputForm.innerHTML += '<input name="key2" class="partial-key" type="text"   value="   ">';
    this.inputForm.innerHTML += '<input name="key3" class="partial-key" type="text"   value="">';
    this.submitForm("reconstruct-button");

    expect(this.mockGenerator.reconstruct)
      .toHaveBeenCalledWith([1, "123123123"], [2, "123123124"]);
  });

  it("strips extraneous whitespace", function() {
    this.inputForm.innerHTML += '<input name="key2" class="partial-key" type="text"   value=" 2-3-123123125  ">';
    this.submitForm("reconstruct-button");

    expect(this.mockGenerator.reconstruct).toHaveBeenCalledWith([1, "123123123"], [2, "123123124"], [3, "123123125"]);
  });

  it("prints out the result of decomposing the secret", function() {
    this.submitForm("reconstruct-button");
    expect(this.outputDiv.innerHTML).toContain("hello");
  });
});
