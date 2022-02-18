import { CustomCommand } from "../exports/types";

import help from "./help";
import info from "./info";
import send from "./send";

/**A list of slash commands*/
const commands: Record<string, CustomCommand> = {
	help,
	info,
	send,
};

export default commands;