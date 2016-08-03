#ffmetadata

A test to use webpack in add-on code

# Note

As of Firefox 48.0, `jpm run` no longer works on stable, so you will need to download a copy of Firefox Nightly.

## Usage

First, `npm install`. Then you must run two commands in separate processes:

- `npm start`, which runs all the watch/build processes for js, css, and dev server,
- `npm run addon`, which runs the addon

**You will need to open Firefox devtools and look for the "Metadata" panel**
