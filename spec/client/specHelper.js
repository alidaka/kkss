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
  });
});
