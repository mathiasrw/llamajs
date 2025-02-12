const encode = require("./encode");
const decode = require("./decode");
const forward = require("./forward");
const sample = require("./sample");

async function generate(transformer, tokenizer, sampler, prompt, steps) {
	// encode prompt
	let promptTokens = [];
	const numPromptTokens = encode(tokenizer, prompt, 1, 0, promptTokens);

	if (numPromptTokens < 1) {
		console.error("Something is wrong, expected at least 1 prompt token\n");
		process.exit(-1);
	}

	let token = promptTokens[0];
	let pos = 0;

	startTime = Date.now();
	reNl = /<0x0A>/g
	while (pos < steps) {
		let logits = forward(transformer, token, pos);

		let next;
		if (pos < numPromptTokens - 1) {
			// if we are still processing the input prompt, force the next prompt token
			next = promptTokens[pos + 1];
		} else {
			// sample next token
			next = sample(sampler, logits);
		}
		pos++;

		// finish on EOS
		if (next === 1) break;

		// print token
		let piece = decode(tokenizer, token, next);
		process.stdout.write(piece.replace(
			reNl, "\n\n"
		));

		token = next;


	}

	process.stdout.write("\n");

	// print stats
	if (pos > 1) {
		let endTime = Date.now();
		let seconds = (endTime - startTime) / 1000;
		console.error({ "Tokens per second": (pos - 1) / seconds });
	}
}

module.exports = generate;
