-include vendor/minond/scaffold/plugins/js.mk

install: dependencies
	npm install

dependencies:
	git submodule update --init

test: js-test
test-coverage: js-test-coverage
lint: js-lint
