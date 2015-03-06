'use strict';

describe('Injector', function () {
    var injector, args, func, ifunc;

    var expect = require('expect.js'),
        Injector = require('../src/injector');

    beforeEach(function () {
        injector = new Injector();
    });

    it('should exist', function () {
        expect(Injector).to.not.be(undefined);
        expect(Injector).to.be.a('function');
        expect(injector instanceof Injector).to.be(true);
    });

    describe('dependency setters and getters', function () {
        it('should be able to set dependencies', function () {
            injector.register('one', 1);
        });

        it('should be able to get dependencies', function () {
            injector.register('one', 1);
            expect(injector.get('one')).to.be(1);
        });

        it('unknown dependency return null', function () {
            expect(injector.get('two')).to.be(null);
        });

        it('returns injector object when setting deps so chaining is possible', function () {
            injector
                .register('one', 1)
                .register('two', 2)
                .register('three', 3)
                .register('four', 4);

            expect(injector.get('one')).to.be(1);
            expect(injector.get('two')).to.be(2);
            expect(injector.get('three')).to.be(3);
            expect(injector.get('four')).to.be(4);
        });
    });

    describe('function argument parser', function () {
        it('returns empty array when no args are taken', function () {
            expect(Injector.$$get_function_arguments(function () {})).to.eql([]);
        });

        it('returns array of arguments', function () {
            expect(Injector.$$get_function_arguments(function (one, two) {
                // just for jshint
                two = one;
            })).to.eql([
                'one', 'two'
            ]);
        });

        it('recognizes functions with no arguments', function () {
            expect(Injector.$$get_function_arguments(function () {
                console.log(arguments);
            })).to.eql([]);
        });

        it('handles no matches', function () {
            expect(Injector.$$get_function_arguments({
                toString: function () {
                    return 'function {}';
                }
            })).to.eql([]);
        });

        it('returns the $inject property when found', function () {
            var func = function () {};
            func.$inject = ['one', 'two'];
            expect(Injector.$$get_function_arguments(func)).to.eql(['one', 'two']);
        });

        it('prefers $inject property over actual arguments', function () {
            var func = function (two, one) {
                return one + two;
            };

            func.$inject = ['one', 'two'];
            expect(Injector.$$get_function_arguments(func)).to.eql(['one', 'two']);
        });
    });

    describe('argument list generator', function () {
        it('non injector args are not ignored', function () {
            args = injector.$$generate_argument_list(['one', 'two'], {one: 1, two: 2});
            expect(args).to.eql([1, 2]);
        });

        it('extra arguments are not ignored', function () {
            args = injector.$$generate_argument_list(['one', 'two'], {three: 3, two: 2, one: 1});
            expect(args).to.eql([1, 2]);
        });

        it('injector arguments are included', function () {
            injector.register('one', 1);
            args = injector.$$generate_argument_list(['one'], []);
            expect(args).to.eql([1]);
        });

        it('injector arguments can be mixed with regular arguments, manual middle', function () {
            injector.register('one', 1);
            injector.register('two', 2);
            args = injector.$$generate_argument_list(['one', 'three', 'two'], {three: 3});
            expect(args).to.eql([1, 3, 2]);
        });

        it('passing no arguments acts the same', function () {
            args = injector.$$generate_argument_list(['one', 'two'], {});
            expect(args).to.eql([undefined, undefined]);
        });
    });

    describe('bound functions', function () {
        it('valueOf returns the same', function () {
            func = function (num) {
                return num;
            };

            ifunc = injector.bind(func);
            expect(ifunc.valueOf()).to.be(func.valueOf());
        });

        it('toString returns the same', function () {
            func = function (num) {
                return num;
            };

            ifunc = injector.bind(func);
            expect(ifunc.toString()).to.be(func.toString());
            expect(ifunc + '').to.be(func + '');
        });

        it('return value is the same', function () {
            func = function (num) {
                return num;
            };

            ifunc = injector.bind(func);
            expect(ifunc({num: 1})).to.be(func(1));
        });

        it('injector arguments as passed', function () {
            injector.register('one', 1);
            injector.register('two', 2);
            ifunc = injector.bind(function (one, two) {
                return one + two;
            });

            expect(ifunc()).to.be(3);
        });

        it('can trigger functions', function () {
            injector.register('one', 1);
            ifunc = injector.trigger(function (one) {
                return one;
            });

            expect(ifunc).to.be(1);
        });

        it('can trigger functions with a scope', function () {
            injector.register('one', 1);
            ifunc = injector.trigger(function (one) {
                return one + this.two;
            }, { two: 2 });

            expect(ifunc).to.be(3);
        });

        it('can trigger functions with a scope by name', function () {
            injector.register('one', 1);
            ifunc = injector.trigger('run', {
                two: 2,
                run: function (one) {
                    return one + this.two;
                }
            });

            expect(ifunc).to.be(3);
        });
    });
});
