(function() {
"use strict";
  KKSS.viewController = function(input, output, generator) {
    this.generator = generator;
    this.output = output;
    this.input = input;

    this.input.addEventListener("submit", this.submitHandler.bind(this));
  };

  KKSS.viewController.prototype._unpackForm = function() {
    return {
      secret: this.input.querySelector("[name=secret]").value,
      totalParts: parseInt(this.input.querySelector("[name=total-parts]").value),
      minimumParts: parseInt(this.input.querySelector("[name=minimum-parts]").value)
    };
  };

  KKSS.viewController.prototype._decomposeSecret = function(secret, minimumParts, totalParts) {
    var keys = this.generator.decompose(secret, minimumParts, totalParts);
    return keys.map(function(key) {
      return [minimumParts, key[0], key[1]].join('-');
    });
  };

  KKSS.viewController.prototype._viewForKeys = function(keys) {
    var list = document.createElement("ul");
    keys.forEach(function(key) {
      var part = document.createElement("li");
      part.innerText = key;
      list.appendChild(part);
    });

    return list;
  };

  KKSS.viewController.prototype._updateView = function(newView) {
    if (this.output.firstChild) {
        this.output.removeChild(this.output.firstChild);
    }

    this.output.appendChild(newView);
  };

  KKSS.viewController.prototype.submitHandler = function(event) {
    event.preventDefault();

    var parameters = this._unpackForm();
    var keys = this._decomposeSecret(parameters.secret, parameters.minimumParts, parameters.totalParts);
    var view = this._viewForKeys(keys);

    this._updateView(view);
    return false;
  };
})();
