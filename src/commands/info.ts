import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { client } from "../exports/client";
import { CustomCommand } from "../exports/types";
import * as data from "../exports/data";

let info: CustomCommand = {
	data: {
		name: "info",
		description: "See information about me!",
	},

	async modalExecute(interaction) {

	},

	async execute(interaction) {
		data.commandUsed("info");
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("#389af0")
					.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/info.png?raw=true")
					.setTitle("Embeds Bot#7040")
					.addFields(
						{
							name: "`Version`",
							value: "4.0"
						},
						{
							name: "`Ping`",
							value: client.ws.ping + "ms"
						},
						{
							name: "`Release Notes (v4)`",
							value: "・Visual Update\n・Many Bug Fixes & Extra Features\n・Improved Reliability"
						},
					)
			],
			components: [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setLabel("Add to Server")
							.setStyle("LINK")
							.setURL("https://discord.com/oauth2/authorize?client_id=942083941307912193&scope=bot%20applications.commands&permissions=150528"),
						// new MessageButton()
						// 	.setLabel("Support Server")
						// 	.setStyle("LINK")
						// 	.setURL("https://google.com"),
						new MessageButton()
							.setLabel("Github")
							.setStyle("LINK")
							.setURL("https://github.com/chr0mevillager/embeds-bot"),
					)
			],
			ephemeral: true,
		});
	},
};

export default info;
