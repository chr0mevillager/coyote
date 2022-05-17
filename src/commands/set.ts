import { Activity, MessageEmbed, PresenceStatusData } from "discord.js";
import * as activity from "../exports/activity";
import logMessage from "../exports/error";
import { client } from "../exports/client";
import { CustomCommand } from "../exports/types";

let set: CustomCommand = {
	data: {
		name: "set",
		description: "Set the status of the bot",
		options: [
			// {
			// 	name: "rotating_status",
			// 	description: "Should the status of the bot rotate?",
			// 	type: 1,
			// 	options: [
			// 		{
			// 			name: "rotate",
			// 			description: "Should the bot's status rotate?",
			// 			type: 5,
			// 			required: true,
			// 		},
			// 		{
			// 			name: "index",
			// 			description: "What status (index) should the bot have?",
			// 			type: 10,
			// 			required: false,
			// 			minValue: 0,
			// 		},
			// 	],
			// },
			{
				name: "status",
				description: "Set the bot's status!",
				type: 1,
				options: [
					{
						name: "status",
						description: "What status should the bot have?",
						type: 3,
						required: false,
						choices: [
							{
								name: "Online",
								value: "online"
							},
							{
								name: "Idle",
								value: "idle"
							},
							{
								name: "Do Not Disturb",
								value: "dnd"
							},
							{
								name: "Invisible",
								value: "invisible"
							}
						],
					},
					{
						name: "activity",
						description: "What action would you like the bot to be doing?",
						type: 3,
						required: false,
						choices: [
							{
								name: "Watching ___",
								value: "WATCHING"
							},
							{
								name: "Listening To ___",
								value: "LISTENING"
							},
							{
								name: "Playing ___",
								value: "STREAMING"
							},
							{
								name: "Competing in ___",
								value: "COMPETING"
							}
						],
					},
					{
						name: "action",
						description: "What action would you like the bot to be doing?",
						type: 3,
						required: false,
					},
				]
			},
		]
	},

	async execute(interaction) {
		try {
			if (interaction.options.getSubcommand() === "status") {

				if (interaction.options.getString("status")) client.user.setStatus(interaction.options.getString("status") as PresenceStatusData);
				if (interaction.options.getString("activity") && interaction.options.getString("action")) client.user.setActivity(interaction.options.getString("action").toString(), { type: interaction.options.getString("activity") as any });
			} else if (interaction.options.getSubcommand() === "rotating_status") {
				activity.setRotateStatus(interaction.options.getBoolean("rotate"));
				if (interaction.options.getInteger("index")) activity.setNextStatus((interaction.options.getNumber("index") - 1))
			}
			await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("#389af0")
						.setTitle("Updated status!")
				],
				ephemeral: true,
			});
		} catch (error) {
			logMessage(error, "set developer command", interaction);
		}
	},
};

export default set;