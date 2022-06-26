import { CustomCommand } from "../exports/types";

import status from "./developer/status";
import bot from "./developer/bot";
import data from "./developer/data";
import mode from "./developer/mode";

import help from "./public/help";
import info from "./public/info";
import send from "./public/send";

/**A list of developer slash commands*/
export const developerCommands: Record<string, CustomCommand> = {
	status,
	bot,
	data,
	mode,
};

/**A list of global, public slash commands*/
export const publicCommands: Record<string, CustomCommand> = {
	help,
	info,
	send,
};