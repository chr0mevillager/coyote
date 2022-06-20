import { CustomCommand } from "../exports/types";

import help from "./public/help";
import info from "./public/info";
import send from "./public/send";

import set from "./developer/set";
import bot from "./developer/bot";
import data from "./developer/data";
import mode from "./developer/mode"

/**A list of developer slash commands*/
export const developerCommands: Record<string, CustomCommand> = {
	set,
	bot,
	data,
	mode,
	send,
};

/**A list of slash commands*/
export const publicCommands: Record<string, CustomCommand> = {
	help,
	info,
	send,
};