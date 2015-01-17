.PHONY: all
all: dist/piggyback-buffer.min.js

dist/piggyback-buffer.js: lib/web.prefix.js lib/index.js lib/web.suffix.js
	grunt concat:web

dist/piggyback-buffer.min.js: dist/piggyback-buffer.js
	npm run minify

.PHONY: test
test:
	npm test

.PHONY: clean
clean:
	rm dist/*.js dist/*.js.map
