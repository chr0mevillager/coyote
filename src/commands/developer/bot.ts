import { MessageEmbed } from "discord.js";
import logMessage from "../../exports/error";
import { client } from "../../exports/client";
import { CustomCommand } from "../../exports/types";
import login from "../../exports/login";

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
			{
				name: "logout_login",
				description: "Would you like to restart the bot? (Script continues to run, will pick up as if nothing happened)",
				type: 1,
				options: [
					{
						name: "offline_duration",
						description: "How long should I go offline?",
						type: "INTEGER",
						required: true,
					},
					{
						name: "confirm",
						description: "Are you sure you want to logout the bot?",
						type: 5,
						required: true,
					},
				]
			},
		]
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
			} else if (interaction.options.getSubcommand() == "logout_login") {
				await client.destroy();
				await setTimeout(login, 3600000 /* 0000 */ * (interaction.options.getInteger("offline_duration") as number), process.env.DISCORD_AUTH);
			}
		} catch (error) {
			logMessage(error, "/bot developer command", interaction);
		}
	},
};
export default bot;