import { MessageEmbed } from "discord.js";
import { client } from "./client";
import * as colors from "./colors";

/** Logs a error in a chat log and notifies the user of a issue. */
export default async function logMessage(error: string, errorLocation: string, interaction?) {
	try {
		await (client.channels.cache.find((channel) => (channel as any).id === process.env.LOGGING_CHANNEL) as any).send({
			content: "@everyone",
			embeds: [
				new MessageEmbed()
					.setColor(colors.secondaryColor)
					.setTitle("An error has occured in the `" + errorLocation + "`!")
					.setDescription("```" + error + "```")
			],
		});

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
		console.error("---\nThe following error occured and was logged on the discord server:");
		console.error(error);
	} catch (error_error) {
		console.error("---\nThe following error occured while attempting to log a previous error:\nError when logging:");
		console.error(error_error);
		console.error("Error that was going to be logged:");
		console.error(error);
	}
}