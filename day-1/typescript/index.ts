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

function adjustDialV1(dialPosition: number, instruction: Instruction): number {
	let newPosition: number;
	if (instruction.direction === Direction.Left) {
		// Not actually sure how this worked the first time??? JS mod of negative returns negative?
		// Maybe it gets fixed when it gets above 100 since this is only counting when it hits exactly 0
		newPosition = (dialPosition - instruction.distance + 100) % 100;
	} else {
		newPosition = (dialPosition + instruction.distance) % 100;
	}
	if (newPosition === 0) {
		timesAtZeroV1++;
	}
	return newPosition;
}

function adjustDialV2(dialPosition: number, instruction: Instruction): number {
	let newPosition: number;
	if (instruction.direction === Direction.Left) {
		newPosition = dialPosition - instruction.distance;
	} else {
		newPosition = dialPosition + instruction.distance;
	}
	console.log(
		`Instruction: ${instruction.direction === Direction.Left ? 'L' : 'R'}${instruction.distance}`
	);
	console.log(`Current Position: ${dialPosition}`);
	console.log(`New Position (Whole): ${newPosition}`);
	console.log(`Current Count: ${timesAtZeroV2}`);
	if (newPosition < 0) {
		timesAtZeroV2 += Math.abs(Math.floor(newPosition / 100));
		if (dialPosition === 0) timesAtZeroV2 -= 1;
		newPosition = Math.abs((newPosition % 100) + 100) % 100;
	} else if (newPosition > 100) {
		timesAtZeroV2 += Math.floor(newPosition / 100);
		if (newPosition % 100 === 0) timesAtZeroV2 -= 1;
	}
	newPosition = newPosition % 100;
	if (newPosition === 0) timesAtZeroV2 += 1;
	console.log(`New Count: ${timesAtZeroV2}`);
	console.log(`New Position: ${newPosition}`);
	console.log(``);
	// 	if (newPosition == 0) timesAtZeroV2++;
	return newPosition;
}

let timesAtZeroV1 = 0;
let timesAtZeroV2 = 0;
let dialPositionV1 = 50;
let dialPositionV2 = 50;

let instructions: Instruction[] = [];

async function readInstructions() {
	const readStream = fs.createReadStream(
		new URL('../../input1.txt', import.meta.url),
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
	dialPositionV1 = adjustDialV1(dialPositionV1, instruction);
	dialPositionV2 = adjustDialV2(dialPositionV2, instruction);
});
console.log(`Times at zero V1: ${timesAtZeroV1}`);
console.log(`Times at zero V2: ${timesAtZeroV2}`);
