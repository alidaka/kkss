(function() {
"use strict";
  KKSS.viewController = function(input, output, generator) {
    this.generator = generator;
    this.output = output;
    this.input = input;

    this.input.addEventListener("submit", this.submitHandler.bind(this));
  };

  KKSS.viewController.prototype._viewForKeys = function(keys, minimumParts) {
    var list = document.createElement("ul");
    for (var i = 0; i < keys.length; i++) {
      var part = document.createElement("li");
      part.innerText = [minimumParts, keys[i][0], keys[i][1]].join('-');
      list.appendChild(part);
    }

    return list;
  };

  KKSS.viewController.prototype.submitHandler = function(event) {
    event.preventDefault();

    var secret = this.input.querySelector("[name=secret]").value;
    var totalParts = parseInt(this.input.querySelector("[name=total-parts]").value);
    var minimumParts = parseInt(this.input.querySelector("[name=minimum-parts]").value);
    var keys = this.generator.decompose(secret, minimumParts, totalParts);

    var view = this._viewForKeys(keys, minimumParts);

    if (this.output.firstChild) {
        this.output.removeChild(this.output.firstChild);
    }

    this.output.appendChild(view);

    return false;
  };
})();
