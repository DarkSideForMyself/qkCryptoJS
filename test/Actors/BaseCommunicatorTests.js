import 'babel-polyfill';
import { getBaseCommunicator } from "../../src/Actors/BaseCommunicator.js";
import { getQuantumChannel } from "../../src/Channels/QuantumChannel.js";
import { PhotonsSize, MinSharedKeyLength } from "../../src/Config/AppConfig.js";
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
chai.should();

describe('BaseCommunicator', () => {
    describe('#props', () => {
        it('exist', () => {
            var baseCommunicator = getBaseCommunicator();
            baseCommunicator.should.have.property('randomBasis');
            baseCommunicator.should.have.property('otherBasis');
            baseCommunicator.should.have.property('sharedKey');
            baseCommunicator.should.have.property('photons');
            baseCommunicator.should.have.property('decision');
            baseCommunicator.should.have.property('otherDecision');
        });
    });
    describe('#function properties', () => {
        it('should be defined', () => {
            var baseCommunicator = getBaseCommunicator();
            baseCommunicator.should.have.property('isValidChannel');
            baseCommunicator.should.have.property('generateRandomBasis');
            baseCommunicator.should.have.property('readBasisFromChannel');
            baseCommunicator.should.have.property('sendBasisToChannel');
            baseCommunicator.should.have.property('decide');
            baseCommunicator.should.have.property('sendDecisionToChannel');
            baseCommunicator.should.have.property('readDecisionFromChannel');
        });
        it('should be functions', () => {
            var baseCommunicator = getBaseCommunicator();
            assert.isFunction(baseCommunicator.isValidChannel, 'isValidChannel');
            assert.isFunction(baseCommunicator.generateRandomBasis, 'generateRandomBasis');
            assert.isFunction(baseCommunicator.readBasisFromChannel, 'readBasisFromChannel');
            assert.isFunction(baseCommunicator.sendBasisToChannel, 'sendBasisToChannel');
            assert.isFunction(baseCommunicator.decide, 'decide');
            assert.isFunction(baseCommunicator.sendDecisionToChannel, 'sendDecisionToChannel');
            assert.isFunction(baseCommunicator.readDecisionFromChannel, 'readDecisionFromChannel');
        });
    });
    describe('#isValidChannel()', () => {
        it('- should catch invalid channel', () => {
            var baseCommunicator = getBaseCommunicator();
            expect(baseCommunicator.isValidChannel.bind({}, {})).to.throw(Error);
        });
        it('- should catch invalid channel (2)', () => {
            var baseCommunicator = getBaseCommunicator();
            expect(baseCommunicator.isValidChannel.bind({}, {BasisUsed: "abc"})).to.throw(Error);
        });
        it('- should not throw valid channel', () => {
            var baseCommunicator = getBaseCommunicator();
            var channel = {
                BasisUsed: "abc",
                Photons: "abc",
                Decision: "abc"
            };
            expect(baseCommunicator.isValidChannel.bind({}, channel)).to.not.throw(Error);
        });
    });
    describe('#readBasisFromChannel()', () => {
        it('- otherBasis should remain empty when channel is invalid.', () => {
            var baseCommunicator = getBaseCommunicator();
            expect(baseCommunicator.readBasisFromChannel.bind({}, { seoifj: "soeifj"})).to.throw(Error);
            expect(baseCommunicator.otherBasis).to.have.length(0);
        });
        it('- otherBasis should adjust to channel basis when channel is valid.', () => {
            var baseCommunicator = getBaseCommunicator();
            var channel = getQuantumChannel();
            channel.BasisUsed = [0, 1, 2, 3, 4];
            baseCommunicator.readBasisFromChannel(channel);
            expect(baseCommunicator.otherBasis).to.have.length(5);
        });
    });
    describe('#sendBasisToChannel()', () => {
        it('- Channel BasisUsed should remain unchanged when channel is invalid.', () => {
            var baseCommunicator = getBaseCommunicator();
            var channel = getQuantumChannel();
            expect(baseCommunicator.sendBasisToChannel.bind({}, {sefoij: "23498"})).to.throw(Error);
            expect(channel.BasisUsed).to.have.length(0);
        });
        it('- Channel BasisUsed should change to randomBasis when channel is valid.', () => {
            var baseCommunicator = getBaseCommunicator();
            var channel = getQuantumChannel();
            baseCommunicator.randomBasis = [0, 1, 2, 3, 4];
            baseCommunicator.sendBasisToChannel(channel);
            expect(channel.BasisUsed).to.have.length(5);
        });
    });
    describe('#decide()', () => {
        it('- Invalid sharedKey should throw error.', () => {
            var baseCommunicator = getBaseCommunicator();
            baseCommunicator.sharedKey = [];
            expect(baseCommunicator.decide.bind({}, {})).to.throw(Error);
        });
        it('- Short sharedKey should lead to a false decision.', () => {
            var baseCommunicator = getBaseCommunicator();
            var i = 0;
            while (i < MinSharedKeyLength - 1) {
                baseCommunicator.sharedKey.push(i);
                i++;
            };
            console.log(baseCommunicator.sharedKey.length);
            baseCommunicator.decide();
            expect(baseCommunicator.decision).to.be.equal(false);
        });
        it('- sharedKey longer than configured MinSharedKeyLength should lead to a true decision.', () => {
            var baseCommunicator = getBaseCommunicator();
            var i = 0;
            while (i < MinSharedKeyLength + 10) {
                baseCommunicator.sharedKey.push(i);
                i++;
            };
            baseCommunicator.decide();
            expect(baseCommunicator.decision).to.be.equal(true);
        });
    });
    describe('#sendDecisionToChannel()', () => {
        it('- Sending decision to invalid channel should throw an error.', () => {
            var baseCommunicator = getBaseCommunicator();
            var channel = getQuantumChannel();
            expect(baseCommunicator.sendDecisionToChannel.bind({}, {sefoij: "23498"})).to.throw(Error);
        });
        it('- Sending decision to valid channel, should store decision in channel.', () => {
            var baseCommunicator = getBaseCommunicator();
            var channel = getQuantumChannel();
            baseCommunicator.decision = true;
            baseCommunicator.sendDecisionToChannel(channel);
            expect(channel.Decision).to.be.equal(true);
        });
    });
    describe('#readDecisionFromChannel()', () => {
        it('- Reading decision from invalid channel should throw error.', () => {
            var baseCommunicator = getBaseCommunicator();
            expect(baseCommunicator.readDecisionFromChannel.bind({}, { seoifj: "soeifj" })).to.throw(Error);
            expect(baseCommunicator.otherDecision).to.be.equal(undefined);
        });
        it('- Reading decision from valid channel should store decision.', () => {
            var baseCommunicator = getBaseCommunicator();
            var channel = getQuantumChannel();
            channel.Decision = true;
            baseCommunicator.readDecisionFromChannel(channel);
            expect(baseCommunicator.otherDecision).to.be.equal(true);
        });
    });
});
