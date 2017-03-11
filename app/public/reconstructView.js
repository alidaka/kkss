(function() {
"use strict";
  KKSS.reconstructView = function(input, generator) {
    this.generator = generator;
    this.input = input;

    this.input.addEventListener("submit", this.submitHandler.bind(this));
  };

  KKSS.reconstructView.prototype.submitHandler = function(event) {
    event.preventDefault();

    var partialKeys = this.input.querySelectorAll(".partial-key");
    var keys = [];
    for (var i = 0; i < partialKeys.length; i++) {
      var text = partialKeys[i].value.trim();
      if (text.length === 0) { continue; }

      var parts = text.split('-');
      keys.push([parseInt(parts[1]), parts[2]]);
    }

    this.generator.reconstruct.apply(this.generator, keys);
  };
})();