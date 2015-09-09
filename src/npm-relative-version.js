// LICENSE : MIT
"use strict";
import npm from "npm";
import semver from "semver";
export function npmLoad() {
    if (npm.config.loaded) {
        return Promise.resolve(npm);
    }
    return new Promise((resolve, reject) => {
        npm.load((error, npm) => {
            if (error) {
                reject(error);
            } else {
                resolve(npm);
            }
        });
    });
}
export function getVersion(pkg) {
    if (pkg["version"] == null) {
        throw new Error("not found `version` in the package: " + pkg);
    }
    return pkg["version"];
}
export function getName(pkg) {
    if (pkg["name"] == null) {
        throw new Error("not found `name` in the package: " + pkg);
    }
    return pkg["name"];
}

export function getVersionsAsync(pkg) {
    var pkgName = getName(pkg);
    var version = getVersion(pkg);
    return npmLoad().then(npm => {
        return new Promise((resolve, reject) => {
            npm.commands.view([`${pkgName}@${version}`, "versions"], true, (error, result) => {
                if (error) {
                    return reject(error);
                }
                // pick up [version]"versions"
                resolve(result[version]["versions"]);
            });
        });
    });
}

var diffTypes = ["patch", "minor", "major"];
export function findVersionMatchDiff(currentVersion, versions, diffType) {
    var diffTypeIndex = diffTypes.indexOf(diffType);
    for (; diffTypeIndex < diffType.length; diffTypeIndex++) {
        var diffTypeForCheck = diffTypes[diffTypeIndex];
        var matchVersions = versions.filter(version => {
            if (semver.diff(version, currentVersion) === diffTypeForCheck) {
                return true;
            }
        });
        if (matchVersions.length > 0) {
            return matchVersions[matchVersions.length - 1];
        }
    }
}
/**
 * get relative version of the package.
 * relative version is specified by the options.
 * @param {object} pkg
 * @param {object} options
 * @returns {Promise.<T>}
 */
export function getRelativeVersion(pkg, options = {}) {
    var isLtr = typeof options.isLtr !== "undefined" ? options.isLtr : true;
    var type = typeof options.type !== "undefined" ? options.type : "path";
    var currentVersion = getVersion(pkg);
    return getVersionsAsync(pkg).then(versions => {
        let indexOfCurrent = versions.indexOf(currentVersion);
        if (isLtr) {
            return findVersionMatchDiff(currentVersion, versions.slice(0, indexOfCurrent), type);
        } else {
            return findVersionMatchDiff(currentVersion, versions.slice(indexOfCurrent, versions.length), type);
        }
    });
}