const path = require('path');
const child_process = require('child_process');

module.exports = (opts = {}) => {
	let input;
	let proc;

	const args = opts.args || [];
	const forkOptions = opts.options || opts;
	delete forkOptions.args;

	return {
		name: 'run',

		options(opts) {
			let inputs = opts.input;

			if (typeof inputs === "string") {
				inputs = [inputs];
			}

			if (typeof inputs === "object") {
				inputs = Object.values(inputs);
			}

			if (inputs.length > 1) {
				throw new Error(`rollup-plugin-run only works with a single entry point`);
			}

			input = path.resolve(inputs[0]);
		},

		generateBundle(outputOptions, bundle, isWrite) {
			if (!isWrite) {
				this.error(`rollup-plugin-run currently only works with bundles that are written to disk`);
			}

			const dir = outputOptions.dir || path.dirname(outputOptions.file);

			let dest;

			for (const fileName in bundle) {
				const chunk = bundle[fileName];

				if (!('isEntry' in chunk)) {
					this.error(`rollup-plugin-run requires Rollup 0.65 or higher`);
				}

				if (!chunk.isEntry) continue;

				if (chunk.modules[input]) {
					dest = path.join(dir, fileName);
					break;
				}
			}

			if (dest) {
				if (proc) proc.kill();
				proc = child_process.fork(dest, args, forkOptions);
			} else {
				this.error(`rollup-plugin-run could not find output chunk`);
			}
		}
	}
};