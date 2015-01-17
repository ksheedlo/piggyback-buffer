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

function isDeferred(obj) {
  return obj !== null &&
    obj.resolve && typeof obj.resolve === 'function' &&
    obj.reject && typeof obj.reject === 'function';
}

function resolveCallbackOrDeferred(callbackOrDeferred, res) {
  if (isDeferred(callbackOrDeferred)) {
    callbackOrDeferred.resolve(res);
  } else {
    callbackOrDeferred(null, res);
  }
}

function rejectCallbackOrDeferred(callbackOrDeferred, reason) {
  if (isDeferred(callbackOrDeferred)) {
    callbackOrDeferred.reject(reason);
  } else {
    callbackOrDeferred(reason);
  }
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
    resolveCallbackOrDeferred(cb, value);
  });
  delete this.$$buffer[cacheKey];
};

PiggybackBuffer.prototype.reject = function (cacheKey, reason) {
  assertPending(this, cacheKey);
  this.$$buffer[cacheKey].forEach(function (cb) {
    rejectCallbackOrDeferred(cb, reason);
  });
  delete this.$$buffer[cacheKey];
};

PiggybackBuffer.prototype.isPending = function (cacheKey) {
  return !isUndefined(this.$$buffer[cacheKey]);
};

if (module) {
  module.exports = PiggybackBuffer;
}
