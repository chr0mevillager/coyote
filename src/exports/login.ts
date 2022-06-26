import { MessageEmbed } from "discord.js";
import { client } from "./client";

export default async function (auth: string) {
	await client.login(auth);
	if (client.application.id == "942083941307912193") {
		(client.channels.cache.find((channel) => (channel as any).id === process.env.LOGGING_CHANNEL) as any).send({
			content: "@everyone",
			embeds: [
				new MessageEmbed()
					.setColor("#389af0")
					.setTitle("Bot Online!")
					.setDescription("Online <t:" + Math.floor(client.readyAt.getTime() / 1000) + ":R>.")
			],
		});
	} else {
		console.log("Bot online!");
	}
}