# npm-relative-version

Get relative version of the modules from npm.

## Installation

    npm install npm-relative-version

## Usage

### getRelativeVersion(pkg, options = { isLtr=true, type="patch" }) : Promise<string>

Get a relative version string of `pkg`.

```js
var getRelativeVersion = require("npm-relative-version").getRelativeVersion;
// pkg.version is 1.0.1
var pkg = require("./package.json");
getRelativeVersion(pkg).then(version => {
    // get -"patch" version
    console.log(version);// 1.0.0
});
```

### getVersionsAsync(pkg): string[]

Get versions array of `pkg`

## Tests

    npm test

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License

MIT