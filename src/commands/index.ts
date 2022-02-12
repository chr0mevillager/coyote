import { CustomCommand } from "../exports/types";

import help from "./help";
import send from "./send";

/**A list of slash commands*/
const commands: Record<string, CustomCommand> = {
	help,
	send,
};

export default commands;