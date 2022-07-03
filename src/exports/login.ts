import { MessageEmbed } from "discord.js";
import { client } from "./client";
import * as colors from "./colors";

export default async function () {
	if (client.application.id == "942083941307912193") {
		(client.channels.cache.find((channel) => (channel as any).id === process.env.LOGGING_CHANNEL) as any).send({
			content: "@everyone",
			embeds: [
				new MessageEmbed()
					.setColor(colors.mainColor)
					.setTitle("Bot Online!")
					.setDescription("Online at <t:" + Math.floor(client.readyAt.getTime() / 1000) + ":D><t:" + Math.floor(client.readyAt.getTime() / 1000) + ":T>\n||`" + Math.floor(client.readyAt.getTime() / 1000) + "`||")
			],
		});
	} else {
		console.log("Bot online!");
	}
}