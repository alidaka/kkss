(function() {
"use strict";
  KKSS.viewController = function(root, generator) {
    this.generator = generator;
    this.root = root;
    root.addEventListener("submit", this.submitHandler.bind(this));
  };

  KKSS.viewController.prototype.submitHandler = function() {
    var secret = this.root.querySelector("[name=secret]").value;
    var totalParts = parseInt(this.root.querySelector("[name=total-parts]").value);
    var minimumParts = parseInt(this.root.querySelector("[name=minimum-parts]").value);
    this.generator.decompose(secret, totalParts, minimumParts);
  };
})();