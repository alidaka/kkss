(function() {
"use strict";
  KKSS.createViewController = function(input, output, generator) {
    return new KKSS.reconstructView(input, output, generator);
  };

  KKSS.reconstructView = function(input, output, generator) {
    this.generator = generator;
    this.input = input;
    this.output = output;

    this.input.addEventListener("submit", this.submitHandler.bind(this));

    this.addKeyButton = this.input.querySelector("[name=add-key-button]");
    this.addKeyButton.addEventListener("click", this.addKeyHandler.bind(this));
  };

  KKSS.reconstructView.prototype.addKeyHandler = function(event) {
    var newKeyField = document.createElement("input");
    newKeyField.classList.add("input");
    newKeyField.setAttribute("type", "text");

    var partialKeyCount = this.input.querySelectorAll(".partial-key").length;
    newKeyField.setAttribute("name", "key"+partialKeyCount);

    this.input.insertBefore(document.createElement("br"), this.addKeyButton);
    this.input.insertBefore(newKeyField, this.addKeyButton);
    return false;
  };

  KKSS.reconstructView.prototype.submitHandler = function(event) {
    event.preventDefault();

    var partialKeys = this.input.querySelectorAll(".input");
    var keys = [];
    for (var i = 0; i < partialKeys.length; i++) {
      var text = partialKeys[i].value.trim();
      if (text.length === 0) { continue; }

      var parts = text.split('-');
      keys.push([parseInt(parts[1]), parts[2]]);
    }

    this.output.innerText = this.generator.reconstruct.apply(this.generator, keys);
    return false;
  };
})();
