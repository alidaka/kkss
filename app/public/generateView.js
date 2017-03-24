(function() {
"use strict";
  KKSS.createViewController = function(input, output, generator) {
    return new KKSS.generateView(input, output, generator);
  };

  KKSS.generateView = function(input, output, generator) {
    this.generator = generator;
    this.output = output;
    this.input = input;

    this.input.addEventListener("submit", this.submitHandler.bind(this));
  };

  KKSS.generateView.prototype.unpackForm = function() {
    return {
      secret: this.input.querySelector("[name=secret]").value,
      totalParts: parseInt(this.input.querySelector("[name=total-parts]").value),
      minimumParts: parseInt(this.input.querySelector("[name=minimum-parts]").value)
    };
  };

  KKSS.generateView.prototype.decomposeSecret = function(secret, minimumParts, totalParts) {
    var keys = this.generator.decompose(secret, minimumParts, totalParts);
    return keys.map(function(key) {
      return [minimumParts, key[0], key[1]].join('-');
    });
  };

  KKSS.generateView.prototype.viewForKeys = function(keys) {
    var list = document.createElement("ul");
    list.classList.add("partial-key-list");
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      var partContainer = document.createElement("li");
      partContainer.classList.add("partial-key-item");
      var part = document.createElement("input");
      part.setAttribute("type", "text");
      part.setAttribute("value", key);
      part.setAttribute("size", key.length);
      part.setAttribute("readonly", "readonly");
      part.classList.add("partial-key");
      part.classList.add("copyable");
      partContainer.appendChild(part);

      var copyButton = document.createElement("button");
      copyButton.classList.add("copy-button");
      copyButton.innerText = "Copy key";
      copyButton.addEventListener("click", function() {
        var keyInput = this.parentElement.querySelector("input");
        keyInput.select();
        document.execCommand("copy");
      });
      partContainer.appendChild(copyButton);

      list.appendChild(partContainer);
    }

    return list;
  };

  KKSS.generateView.prototype.updateView = function(newView) {
    if (this.output.firstChild) {
        this.output.removeChild(this.output.firstChild);
    }

    this.output.appendChild(newView);
  };

  KKSS.generateView.prototype.submitHandler = function(event) {
    event.preventDefault();

    var parameters = this.unpackForm();
    var keys = this.decomposeSecret(parameters.secret, parameters.minimumParts, parameters.totalParts);
    var view = this.viewForKeys(keys);

    this.updateView(view);
    return false;
  };
})();
