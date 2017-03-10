(function() {
"use strict";
  KKSS.viewController = function(input, output, generator) {
    this.generator = generator;
    this.output = output;
    this.input = input;
    this.input.addEventListener("submit", this.submitHandler.bind(this));
  };

  KKSS.viewController.prototype.submitHandler = function(event) {
    event.preventDefault();
    var secret = this.input.querySelector("[name=secret]").value;
    var totalParts = parseInt(this.input.querySelector("[name=total-parts]").value);
    var minimumParts = parseInt(this.input.querySelector("[name=minimum-parts]").value);

    var partialKeys = this.generator.decompose(secret, minimumParts, totalParts);

    var list = document.createElement("ul");
    for (var i = 0; i < partialKeys.length; i++) {
      var part = document.createElement("li");
      part.innerText = [minimumParts, partialKeys[i][0], partialKeys[i][1]].join('-');
      list.appendChild(part);
    }

    if (this.output.firstChild)
    {
        this.output.removeChild(this.output.firstChild);
    }

    this.output.appendChild(list);

    return false;
  };
})();
