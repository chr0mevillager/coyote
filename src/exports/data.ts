let message = {
	uses: 0,
	buttonUses: {
		send: 0,
		cancel: 0,
	}
};
let poll = {
	uses: 0,
	buttonUses: {
		send: 0,
		cancel: 0,
		response: 0,
	}
};
let giveaway = {
	uses: 0,
	buttonUses: {
		send: 0,
		cancel: 0,
		entry: 0,
	}
};
let help = {
	uses: 0,
};
let info = {
	uses: 0,
};

export let data = {
	message,
	poll,
	giveaway,
	help,
	info,
};

export function commandUsed(command: string) {
	data[command].uses++;
}

export function buttonUsed(command: string, button: string) {
	data[command].buttonUses[button]++;
}