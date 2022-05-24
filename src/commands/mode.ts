import { Activity, MessageEmbed, PresenceStatusData } from "discord.js";
import logMessage from "../exports/error";
import { client } from "../exports/client";
import { CustomCommand, mode } from "../exports/types";
import { setMode } from "../exports/mode";
import generateTimeStamp from "../exports/timestamp";

let mode: CustomCommand = {
	data: {
		name: "mode",
		description: "Set the mode of the bot.",
		options: [
			{
				name: "normal",
				description: "Would you like to give the bot normal behavior? (default)",
				type: 1,
				options: [
					{
						name: "confirm",
						description: "Are you sure you want to change the bot's mode?",
						type: 5,
						required: true,
					}
				]
			},
			{
				name: "update",
				description: "Would you like to warn users of an upcoming update?",
				type: 1,
				options: [
					{
						name: "confirm",
						description: "Are you sure you want to change the bot's mode?",
						type: 5,
						required: true,
					}
				]
			},
			{
				name: "warning",
				description: "Would you like to warn users of an issue or outage?",
				type: 1,
				options: [
					{
						name: "warning",
						description: "What would you like to warn the users of? (ex. a fire)",
						type: "STRING",
						required: true,
					},
					{
						name: "confirm",
						description: "Are you sure you want to change the bot's mode?",
						type: 5,
						required: true,
					}
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
						.setTitle("Enabling " + interaction.options.getSubcommand() + " mode")
				],
				ephemeral: true,
			});

			if (!interaction.options.getBoolean("confirm")) return;
			if (interaction.user.id != process.env.OWNER_ID) return;

			if (interaction.options.getSubcommand() == "warning") {
				setMode(interaction.options.getSubcommand() as mode, interaction.options.getString("warning"));
			} else if (interaction.options.getSubcommand() == "update") {
				setMode(interaction.options.getSubcommand() as mode, "an upcoming update");
			} else {
				setMode(interaction.options.getSubcommand() as mode);
			}


		} catch (error) {
			logMessage(error, "set developer command", interaction);
		}
	},
};
export default mode;