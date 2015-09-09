// LICENSE : MIT
"use strict";
import assert from "power-assert"
import {getRelativeVersion,getVersionsAsync} from "../src/npm-relative-version"
import semver from "semver"
const npmPkg = require("./fixtures/package.json");
const currentVersion = npmPkg["version"];
describe("npm-relative-version", function () {
    describe("#npm-relative-version", function () {
        it("should return versions of the package", function () {
            return getVersionsAsync(npmPkg).then(result => {
                assert(Array.isArray(result));
            });
        });
    });
    describe("getRelativeVersion", function () {
        it("should return -patch version from current", function () {
            return getRelativeVersion(npmPkg).then(version => {
                assert.equal(semver.diff(version, currentVersion), "patch");
            });
        });
        it("should return +patch version from current", function () {
            return getRelativeVersion(npmPkg, {
                isLtr: false,
                type: "major"
            }).then(version => {
                assert.equal(semver.diff(version, currentVersion), "major");
            });
        });
        context("when not found patch version", function () {
            it("should search minor version", function () {
                return getRelativeVersion({
                    name: "npm",
                    version: "2.14.0"// not found -patch
                }).then(version => {
                    assert.equal(semver.diff(version, currentVersion), "minor");
                });
            });
        })
    });
});