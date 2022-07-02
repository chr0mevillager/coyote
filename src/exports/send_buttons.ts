import {
	MessageActionRow,
	MessageButton,
} from "discord.js";
import * as emoji from "./emoji";

export const buttonRow = (uuid: string) => new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId(uuid + "::send")
			.setLabel("Send")
			.setEmoji(emoji.white.confirm)
			.setStyle("SUCCESS"),
		new MessageButton()
			.setCustomId(uuid + "::cancel")
			.setLabel("Cancel")
			.setEmoji(emoji.white.cancel)
			.setStyle("DANGER"),
	);
export const buttonRowDisabled = (uuid: string) => new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId(uuid + "::send")
			.setLabel("Send")
			.setEmoji(emoji.white.confirm)
			.setStyle("SUCCESS")
			.setDisabled(true),
		new MessageButton()
			.setCustomId(uuid + "::cancel")
			.setLabel("Cancel")
			.setEmoji(emoji.white.cancel)
			.setStyle("DANGER")
			.setDisabled(true),
	);