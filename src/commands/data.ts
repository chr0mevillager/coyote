import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import * as activity from "../exports/activity";
import { client } from "../exports/client";
import { CustomCommand } from "../exports/types";

let data: CustomCommand = {
	data: {
		name: "data",
		description: "See a detailed log of information about me!",
	},
	async execute(interaction) {
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("#389af0")
					.setTitle("Embeds Bot")
					.addFields(
						{ name: "\u2800\nServer:", value: "\u2800" },
						{ name: "`Ping:`", value: (client.ws.ping + "ms"), inline: true },
						{ name: "`Online since:`", value: ("<t:" + Math.floor(client.readyAt.getTime() / 1000) + ">"), inline: true },
						{ name: "\u2800\nBot:", value: "\u2800" },
						{ name: "`Server Count:`", value: (client.guilds.cache.size + ""), inline: true },
						{ name: "`Activity:`", value: ("Index: " + activity.activityIndex + "\nWill Rotate: " + activity.activityRotation), inline: true },
					)
			],
			ephemeral: true,
		});
	},
};

export default data;