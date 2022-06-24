import {
	MessageActionRow,
	MessageButton,
} from "discord.js";

export const buttonRow = (uuid: string) => new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId(uuid + "::send")
			.setLabel("Send ✉")
			.setStyle("SUCCESS"),
		new MessageButton()
			.setCustomId(uuid + "::cancel")
			.setLabel("Cancel ✖")
			.setStyle("DANGER"),
	);
export const buttonRowDisabled = (uuid: string) => new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId(uuid + "::send")
			.setLabel("Send ✉")
			.setStyle("SUCCESS")
			.setDisabled(true),
		new MessageButton()
			.setCustomId(uuid + "::cancel")
			.setLabel("Cancel ✖")
			.setStyle("DANGER")
			.setDisabled(true),
	);