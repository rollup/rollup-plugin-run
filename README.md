# rollup-plugin-run

Run your bundles in Node once they're built.

## Why

You're building a Node app with Rollup. During development, you want to restart the app each time your source code changes. One way to solve that would be to use [nodemon](https://nodemon.io/) targeted at Rollup's output, but that's a bit like using a bazooka to kill a fly.

Instead, you can add this simple plugin, which gives much faster results.

## What

Each time your bundle is rebuilt, this plugin starts the generated file as a child process (after first closing the previous process, if it's not the first run).

It works with Rollup's code-splitting if you're using dynamic `import(...)` — the only constraint is that you have a single entry point specified in the config.

## How

Install it in the usual manner...

```bash
npm i -D rollup-plugin-run
```

...then add it to your config:

```js
// rollup.config.js
import run from 'rollup-plugin-run';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
    run()
  ]
};
```

Note that we're using the `cjs` format, because we're running the app in Node.

## When

By default, always. Since this feature is intended for development use, you may prefer to only include it when Rollup is being run in watch mode:

```diff
// rollup.config.js
import run from 'rollup-plugin-run';

+const dev = process.env.ROLLUP_WATCH === 'true';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/index.js',
    format: 'cjs'
  },
  plugins: [
-    run()
+    dev && run()
  ]
};
```

## License

[LIL](LICENSE)