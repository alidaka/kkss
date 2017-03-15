describe("Client performance", function() {
  beforeEach(function() {
    this.time = function(operation, message) {
      var startTime = new Date();
      operation();
      var endTime = new Date();
      console.log(message + (endTime - startTime));
    }
  });

  it("times short operations", function() {
    var message = "hello, world";
    var subject = new KKSS.generator(new KKSS.random());

    var parts;
    this.time(function() {parts = subject.decompose(message, 2, 3);}, "decomposition: ");

    this.time(function() {subject.reconstruct.apply(subject, parts.slice(0, 2));}, "reconstruction: ");
  });

  it("times long operations", function() {
    var message = "this is a relatively long secret, probably at least 32 characters...twice" +
      "this is a relatively long secret, probably at least 32 characters...twice";
    var subject = new KKSS.generator(new KKSS.random());

    var parts;
    this.time(function() {parts = subject.decompose(message, 80, 120);}, "decomposition: ");

    this.time(function() {subject.reconstruct.apply(subject, parts.slice(0, 80));}, "reconstruction: ");
  });

  it("generates a exp table", function() {
    var order = KKSS.order;
    var exp3 = new Array(order);
    var log3 = new Array(order);
    var fieldAccumulator = 1;

    for (var i = 0; i < order; i++) {
      exp3[i] = fieldAccumulator;
      log3[fieldAccumulator] = i;
      fieldAccumulator = KKSS.multiply(fieldAccumulator, 3);
    }

    var res = '';
    for (var i = 0; i < 256; i = i + 8) {
      res +=  '0x' + exp3[i].toString(16) + ', 0x' + exp3[i+1].toString(16) +
        ', 0x' + exp3[i+2].toString(16) + ', 0x' + exp3[i+3].toString(16) +
        ', 0x' + exp3[i+4].toString(16) + ', 0x' + exp3[i+5].toString(16) +
        ', 0x' + exp3[i+6].toString(16) + ', 0x' + exp3[i+7].toString(16) + '\n';
    }
    console.log("exp3");
    console.log(res);

    log3[0] = 0;
    var res = '';
    for (var i = 0; i < 256; i = i + 8) {
      res +=  '0x' + log3[i].toString(16) + ', 0x' + log3[i+1].toString(16) +
        ', 0x' + log3[i+2].toString(16) + ', 0x' + log3[i+3].toString(16) +
        ', 0x' + log3[i+4].toString(16) + ', 0x' + log3[i+5].toString(16) +
        ', 0x' + log3[i+6].toString(16) + ', 0x' + log3[i+7].toString(16) + '\n';
    }
    console.log("log3");
    console.log(res);
  });
});