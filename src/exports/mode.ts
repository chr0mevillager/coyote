import { MessageEmbed } from "discord.js";
import { mode, CustomCommand } from "./types";

export let currentMode = "";
export let description = "";
export let image = "";

export function setMode(newMode: mode, newDescription?: string) {
	currentMode = newMode;

	if (newDescription && newDescription != "") {
		description = "\u200b\n" + "Due to " + newDescription + ", this may be interrupted and stop working unexpectedly." + "\n\nWe recommend waiting to proceed.";
	} else {
		description = "";
	}

	if (newMode == "normal") image = "https://github.com/chr0mevillager/coyote/blob/master/src/artwork/send/ready_to_send.png?raw=true";
	if (newMode == "warning") image = "https://github.com/chr0mevillager/coyote/blob/master/src/artwork/send/warning.png?raw=true";
	if (newMode == "update") image = "https://github.com/chr0mevillager/coyote/blob/master/src/artwork/send/update_pending.png?raw=true";
}