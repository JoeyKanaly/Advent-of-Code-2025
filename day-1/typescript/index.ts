import fs from 'fs';
import * as readline from 'readline';

enum Direction {
	Left,
	Right,
}

interface Instruction {
	direction: Direction;
	distance: number;
}

function adjustDial(dialPosition: number, instruction: Instruction): number {
	let newPosition: number;
	if (instruction.direction === Direction.Left) {
		newPosition = (dialPosition - instruction.distance + 100) % 100;
	} else {
		newPosition = (dialPosition + instruction.distance) % 100;
	}
	if (newPosition === 0) {
		timesAtZero++;
	}
	return newPosition;
}

let timesAtZero = 0;
let dialPosition = 50;

let instructions: Instruction[] = [];

async function readInstructions() {
	const readStream = fs.createReadStream(
		new URL('../../input1.txt',import.meta.url),
		{
			encoding: 'utf8',

		}
	);
	const rl = readline.createInterface({
		input: readStream,
		crlfDelay: Infinity,
	});
	try {
		for await (const line of rl) {
			let instruction: Instruction = {
				direction: Direction.Right,
				distance: 0,
			};
			if (line[0] === 'L') {
				instruction.direction = Direction.Left;
			}
			instruction.distance = parseInt(line.slice(1));
			instructions.push(instruction);
		}
	} catch (error: any) {
		console.error(`Error reading file: ${error.message}`);
	}
}
await readInstructions();
instructions.forEach((instruction) => {
	dialPosition = adjustDial(dialPosition, instruction);
});
console.log(`Times at zero: ${timesAtZero}`);
