import { MessageEmbed } from "discord.js";
import { client } from "./client";

/** Logs a error in a chat log and notifies the user of a issue. */
export default async function logMessage(error: string, errorLocation: string, interaction?) {
	if (interaction) {
		await interaction.reply({
			ephemeral: true,
			embeds: [
				new MessageEmbed()
					.setColor("#2f3136")
					.setTitle("An error has occured!")
					.setDescription("The developers were notified of this error and it will be fixed shortly.")
			],
		});
	}
	await (client.channels.cache.find((channel) => (channel as any).id === "971927932790534204") as any).send({
		embeds: [
			new MessageEmbed()
				.setColor("#2f3136")
				.setTitle("An error has occured in the `" + errorLocation + "`!")
				.setDescription("```" + error + "```")
		],
	});
}