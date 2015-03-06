-include .scaffold/plugins/js.mk

dependencies:
	git submodule update --init

install: dependencies npm-install
test: js-test
test-coverage: js-test-coverage
lint: js-lint
