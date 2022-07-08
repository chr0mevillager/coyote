import { MessageEmbed } from "discord.js";
import { client } from "./client";
import * as activity from "./activity";
import { getData } from "../exports/data";
import * as colors from "./colors";

/**Start logging data regarding the bot every 24 hours */
export async function logData() {
	const topMessage = new MessageEmbed()
		.setColor(colors.mainColor)
		.setTitle("Your Daily Data is Ready!")
		.setDescription("")
		.addFields([
			{
				name: "Server Count",
				value: "```" + client.guilds.cache.size + "```",
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
		]);
	await (client.channels.cache.find((channel) => (channel as any).id === process.env.LOGGING_CHANNEL) as any).send({
		embeds: getData(topMessage),
	});
	setTimeout(logData, 86400000);
}