let generator;

function randomU32(seed) {
	generator = generator || new Xorshift32(seed);
	return generator.next()
}

function randomF32(seed) {
	generator = generator || new Xorshift32(seed);
	return generator.nextFloat()
}
module.exports = { randomF32, randomU32 };




class Xorshift32 {
	constructor(seed) {
		this.state = seed;
	}

	next() {
		this.state ^= this.state << 13;
		this.state ^= this.state >>> 17;
		this.state ^= this.state << 5;
		this.state &= 0xFFFFFFFF;
		return this.state;
	}

	nextFloat() {
		return (this.next() >>> 0) / 0xFFFFFFFF;
	}
}
