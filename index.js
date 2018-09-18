const path = require('path');
const child_process = require('child_process');

module.exports = () => {
	let input;
	let proc;

	return {
		name: 'run',

		options(opts) {
			if (Array.isArray(opts.input)) {
				if (opts.input.length > 1) {
					throw new Error(`rollup-plugin-run only works with a single entry point`);
				} else {
					input = opts.input[0];
				}
			} else {
				input = opts.input;
			}
		},

		generateBundle(outputOptions, bundle, isWrite) {
			if (!isWrite) {
				this.error(`rollup-plugin-run currently only works with bundles that are written to disk`);
			}

			const dir = outputOptions.dir || path.dirname(outputOptions.file);

			const basename = path.basename(input);
			const chunk = bundle[basename];

			if (!chunk) {
				this.error(`rollup-plugin-run could not find output chunk`);
			}

			const mod = path.join(dir, chunk.fileName);

			if (proc) proc.kill();
			proc = child_process.fork(mod);
		}
	}
};