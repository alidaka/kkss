(function() {
"use strict";
  KKSS.viewController = function(root, generator) {
    this.generator = generator;
    root.querySelector("#generate-button").onclick = this.clickHandler.bind(this);
  };

  KKSS.viewController.prototype.clickHandler = function() {
    this.generator.decompose();
  };
})();