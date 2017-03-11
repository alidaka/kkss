beforeEach(function() {
  jasmine.addMatchers({
    toEqualWithMessage: function(util, customEqualityTesters) {
      return {
        compare: function(actual, expected, message) {
          return {
            pass: util.equals(actual, expected, customEqualityTesters),
            message: message
          };
        }
      }
    }
  })

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
