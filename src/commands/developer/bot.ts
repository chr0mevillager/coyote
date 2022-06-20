import { Activity, MessageEmbed, PresenceStatusData } from "discord.js";
import logMessage from "../../exports/error";
import { client } from "../../exports/client";
import { CustomCommand } from "../../exports/types";

let bot: CustomCommand = {
	data: {
		name: "bot",
		description: "Logout or restart the bot.",
		options: [
			{
				name: "restart",
				description: "Would you like to restart the bot? (Disable all open interactions, script restarts)",
				type: 1,
				options: [
					{
						name: "confirm",
						description: "Are you sure you want to restart the bot?",
						type: 5,
						required: true,
					}
				]
			},
			{
				name: "logout",
				description: "Would you like to logout the bot? (Disable all functionality, script continues to run)",
				type: 1,
				options: [
					{
						name: "confirm",
						description: "Are you sure you want to logout the bot? This will end all on-going interactions.",
						type: 5,
						required: true,
					}
				]
			},
		]
	},

	async modalExecute(interaction) {

	},

	async execute(interaction) {
		try {
			await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("#389af0")
						.setTitle("Pending " + interaction.options.getSubcommand())
				],
				ephemeral: true,
			});
			if (!interaction.options.getBoolean("confirm")) return;
			if (interaction.user.id != process.env.OWNER_ID) return;
			if (interaction.options.getSubcommand() == "restart") {
				await process.exit(0);
			} else if (interaction.options.getSubcommand() == "logout") {
				await client.destroy();
			}
		} catch (error) {
			logMessage(error, "set developer command", interaction);
		}
	},
};
export default bot;