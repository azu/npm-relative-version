// LICENSE : MIT
"use strict";
import assert from "power-assert"
import {getRelativeVersion,getVersionsAsync,npmLoad} from "../src/npm-relative-version"
import semver from "semver"
const mr = require("npm-registry-mock");
const npmPkg = require("./fixtures/request-latest.json");

describe("npm-relative-version", function () {
    before(function () {
        return new Promise((resolve, reject) => {
            mr({port: 1331}, function (err, s) {
                npmLoad({registry: "http://localhost:1331"}).then(resolve, reject);
            });
        });
    });
    describe("#npm-relative-version", function () {
        it("should return versions of the package", function () {
            return getVersionsAsync(npmPkg).then(result => {
                assert(Array.isArray(result));
            });
        });
    });
    describe("getRelativeVersion", function () {
        it("should return -patch version from current", function () {
            // checker at 0.5.1, 0.5.2
            var currentVersion = "0.5.2";
            return getRelativeVersion({
                name: "checker",
                version: currentVersion
            }).then(version => {
                assert.equal(version, "0.5.1", "should be -patch version");
                assert.equal(semver.diff(version, currentVersion), "patch");
            });
        });
        it("should return +patch version from current", function () {
            // request at 0.9.0, 0.9.5 and 2.27.0 while version 2.27.0 is the latest in this mocked registry.
            var currentVersion = "1.0.0";
            return getRelativeVersion({
                name: "request",
                version: currentVersion
            }, {
                isLtr: false,
                type: "major"
            }).then(version => {
                assert.equal(version, "2.27.0", "should be +major latest");
                assert.equal(semver.diff(version, currentVersion), "major");
            });
        });
        context("when not found patch version", function () {
            it("should search minor version", function () {
                // request at 0.9.0, 0.9.5 and 2.27.0 while version 2.27.0 is the latest in this mocked registry.
                return getRelativeVersion({
                    name: "request",
                    version: "2.27.0"// not found -patch
                }).then(version => {
                    assert.equal(semver.diff(version, "2.27.0"), "minor");
                });
            });
        });

        context("when not current version in npm", function () {
            it("should search latest version in npm", function () {
                // request at 0.9.0, 0.9.5 and 2.27.0 while version 2.27.0 is the latest in this mocked registry.
                return getRelativeVersion({
                    name: "request",
                    version: "2.28.0"// not found in npm
                }).then(version => {
                    assert.equal(version, "2.27.0", "should be latest");
                });
            });
        });
    });
});