(function() {
"use strict";
  KKSS.aes = function() {
  };

  KKSS.aes.prototype.encrypt = function(secret, key) {
    var secretBytes = aesjs.utils.utf8.toBytes(secret);

    var aesCtr = new aesjs.ModeOfOperation.ctr(key);
    var encryptedBytes = aesCtr.encrypt(secretBytes);

    return aesjs.utils.hex.fromBytes(encryptedBytes);
  };

  KKSS.aes.prototype.decrypt = function(encryptedSecret, key) {
    var encryptedBytes = aesjs.utils.hex.toBytes(encryptedSecret);

    var aesCtr = new aesjs.ModeOfOperation.ctr(key);
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  };
})();
