describe("generateMessageView", function() {
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

    this.mockRandom = {
      nextByte: jasmine.createSpy('nextByte').and.returnValue(123)
    };
    this.expectedAesKey = [123, 123, 123, 123, 123, 123, 123, 123,
                           123, 123, 123, 123, 123, 123, 123, 123,
                           123, 123, 123, 123, 123, 123, 123, 123,
                           123, 123, 123, 123, 123, 123, 123, 123];

    this.encryptedSecret = 'a338eda3874ed884b6199150d36f49';
    this.aes = {
      encrypt: jasmine.createSpy('encrypt').and.returnValue(this.encryptedSecret)
    };

    jasmine.Ajax.install();
    jasmine.Ajax.stubRequest('/message').andReturn({
      "responseText": '{"id": "21b478f5-4135-4f55-b584-85c3938af7b1"}'
    });

    this.subject = new KKSS.generateMessageView(this.inputForm, this.outputDiv, this.mockGenerator, this.mockRandom, this.aes);
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
  });

  it("generates and decomposes an AES key when the submit button is clicked", function() {
    this.submitForm("generate-button");
    expect(this.mockGenerator.decompose).toHaveBeenCalledWith(this.expectedAesKey, 2, 3);
  });

  it("encrypts the secret", function() {
    this.submitForm("generate-button");
    expect(this.aes.encrypt).toHaveBeenCalledWith("hello", this.expectedAesKey);
  });

  it("saves the encrypted secret to the server", function() {
    this.submitForm("generate-button");

    var request = jasmine.Ajax.requests.mostRecent();
    expect(request.url).toBe('/message');
    expect(request.method).toBe('POST');
    expect(request.params).toBe('{"secret":"' + this.encryptedSecret + '"}');
  });

  it("prints out the result of decomposing the secret", function() {
    this.submitForm("generate-button");
    expect(this.outputDiv.innerHTML).toContain("2-1-123123123");
    expect(this.outputDiv.innerHTML).toContain("2-2-123123124");
    expect(this.outputDiv.innerHTML).toContain("2-3-123123125");
    //expect(this.outputDiv.innerHTML).toContain("url to reconstruct page");
  });
});
