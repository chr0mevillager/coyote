import { MessageEmbed } from "discord.js";
import * as activity from "../../exports/activity";
import { client } from "../../exports/client";
import { CustomCommand } from "../../exports/types";
import { getData } from "../../exports/data";
import * as profileInfo from "../../exports/profile_info";
import { logData } from "../../exports/daily_data";

let data: CustomCommand = {
	data: {
		name: "data",
		description: "See a detailed log of information about me!",
	},

	async onReadyExecute() {
		setTimeout(logData, 86400000 /* 0000 */);
	},

	async execute(interaction) {
		let topEmbed = new MessageEmbed()
			.setTitle("Your Data is Ready!")
			.setColor("#389af0")
			.setDescription("")
			.addFields([
				{
					name: "Server Count",
					value: "```" + client.guilds.cache.size + "```",
					inline: true,
				},
				{
					name: "Ping",
					value: "```" + client.ws.ping + "ms```",
					inline: true,
				},
				{
					name: "Online since",
					value: "```" + Math.floor(client.readyAt.getTime() / 1000) + "```(<t:" + Math.floor(client.readyAt.getTime() / 1000) + ":D> <t:" + Math.floor(client.readyAt.getTime() / 1000) + ":T>)",
					inline: true,
				},
				{
					name: "Activity",
					value: "```Index: " + activity.activityIndex + "``````Will Rotate: " + activity.activityRotation + "```",
					inline: true,
				},
				{
					name: "Version",
					value: "```Index: " + profileInfo.versionNumber + "```",
					inline: true,
				},
			]);

		await interaction.reply({
			embeds: getData(topEmbed),
			ephemeral: true,
		});
	},
};

export default data;