(function() {
"use strict";
  KKSS.createViewController = function(input, output, generator) {
    return new KKSS.generateMessageView(input, output, generator, new random());
  };

  KKSS.generateMessageView = function(input, output, generator, random, aes) {
    KKSS.generateView.prototype.constructor.call(this, input, output, generator);
    this.random = random;
    this.aes = aes;
  };

  KKSS.generateMessageView.prototype = Object.create(KKSS.generateView.prototype);

  KKSS.generateMessageView.prototype.constructor = KKSS.generateMessageView;

  KKSS.generateMessageView.prototype.decomposeSecret = function(secret, minimumParts, totalParts) {
    var aesKey = new Array(32);
    for (var i = 0; i < 32; i++) {
      aesKey[i] = this.random.nextByte();
    }

    var encryptedSecret = this.aes.encrypt(secret, aesKey);
    var id = this._saveSecret(encryptedSecret);

    /////////////////////////////////////////
    // save encrypted message to server
    // decompose AES key (return to users)
    return KKSS.generateView.prototype.decomposeSecret.call(this, aesKey, minimumParts, totalParts);
  };

  KKSS.generateMessageView.prototype._saveSecret = function(encryptedSecret) {
    var xhr = new XMLHttpRequest();
    var result;
    xhr.onreadystatechange = function(args) {
      if (this.readyState == this.DONE) {
        result = JSON.parse(this.responseText);
      }
    };

    var payload = '{"secret":"' + encryptedSecret + '"}'
    xhr.open("POST", "/message", false);
    xhr.send(payload);

    return result.id;
  };
})();
