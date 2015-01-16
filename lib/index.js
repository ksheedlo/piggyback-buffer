'use strict';

function isUndefined(val) {
  return val === void 0;
}

function assertPending (requestBuffer, cacheKey) {
  if (!requestBuffer.isPending(cacheKey)) {
    throw new Error('[PiggybackBuffer:notpending] Tried to resolve or reject ' +
        'a nonexistent buffered request for key: ' + cacheKey);
  }
}

function PiggybackBuffer () {
  this.$$buffer = {};
}

PiggybackBuffer.prototype.queue = function (cacheKey, cb) {
  if (isUndefined(this.$$buffer[cacheKey])) {
    this.$$buffer[cacheKey] = [];
  }
  this.$$buffer[cacheKey].push(cb);
};

PiggybackBuffer.prototype.resolve = function (cacheKey, value) {
  assertPending(this, cacheKey);
  this.$$buffer[cacheKey].forEach(function (cb) {
    cb(null, value);
  });
  delete this.$$buffer[cacheKey];
};

PiggybackBuffer.prototype.reject = function (cacheKey, reason) {
  assertPending(this, cacheKey);
  this.$$buffer[cacheKey].forEach(function (cb) {
    cb(reason);
  });
  delete this.$$buffer[cacheKey];
};

PiggybackBuffer.prototype.isPending = function (cacheKey) {
  return !isUndefined(this.$$buffer[cacheKey]);
};

module.exports = PiggybackBuffer;
