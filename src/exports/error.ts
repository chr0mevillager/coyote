import { MessageEmbed } from "discord.js";
import { client } from "./client";
import * as colors from "./colors";

/** Logs a error in a chat log and notifies the user of a issue. */
export default async function logMessage(error: string, errorLocation: string, interaction?) {
	try {
		if (interaction) {
			try {
				await interaction.reply({
					ephemeral: true,
					embeds: [
						new MessageEmbed()
							.setColor(colors.secondaryColor)
							.setTitle("An error has occured!")
							.setDescription("The developers were notified of this error and it will be fixed shortly.")
					],
				});
			} catch { }
		}
		await (client.channels.cache.find((channel) => (channel as any).id === process.env.LOGGING_CHANNEL) as any).send({
			content: "@everyone",
			embeds: [
				new MessageEmbed()
					.setColor(colors.secondaryColor)
					.setTitle("An error has occured in the `" + errorLocation + "`!")
					.setDescription("```" + error + "```")
			],
		});
		console.error("An error occured whenever trying to log an error in the discord server:")
		console.error(error);
	} catch (error) {
		console.error(error);
	}
}