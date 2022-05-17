import { MessageEmbed } from "discord.js";
import { CustomCommand } from "../exports/types";
import messageInteraction from "./send/message"
import pollInteraction from "./send/poll";

let send: CustomCommand = {
	data: {
		name: "send",
		description: "Send an embeded message!",
		options: [
			{
				name: "message",
				description: "Send a fancy message!",
				type: 1,
				options: [
					{
						name: "title",
						description: "What do you want the message to be titled? (≤ 256 characters)",
						type: 3,
						required: true,
					},
					{
						name: "description",
						description: "What do you want the description to be? (≤ 4000 characters)",
						type: 3,
						required: true,
					},
					{
						name: "image",
						description: "What do you want the image to be? (Link)",
						type: 3,
						required: false,
					},
				]
			},

			//Polls may be added in the future

			{
				name: "poll",
				description: "Send a poll!",
				type: 1,
				options: [
					{
						name: "question",
						description: "What do you want the message to be titled? (≤ 256 characters)",
						type: 3,
						required: true,
					},
					{
						name: "visible-results",
						description: "Should users be able to see the total number of votes during the poll?",
						type: "BOOLEAN",
						required: true,
					},
					{
						name: "option-1",
						description: "What should the first option be? (≤ 80 characters)",
						type: 3,
						required: true,

					},
					{
						name: "option-2",
						description: "What should the second option be? (≤ 80 characters)",
						type: 3,
						required: true,
					},
					{
						name: "option-3",
						description: "What should the third option be? (≤ 80 characters)",
						type: 3,
						required: false,
					},
					{
						name: "option-4",
						description: "What should the fourth option be? (≤ 80 characters)",
						type: 3,
						required: false,
					},
				]
			},
		],
	},

	async execute(interaction) {

		// await interaction.reply({
		// 	embeds: [
		// 		new MessageEmbed()
		// 			.setTitle("Error")
		// 			.setDescription("Due to a memorly leak, the `/send` commands have been temporarily disabled. This issue is being worked on and should be fixed soon.")
		// 			.setColor("#ff6c08")
		// 	],
		// 	ephemeral: true,
		// });
		// return;

		if (interaction.options.getSubcommand() === "message") {
			messageInteraction(interaction);
		} else if (interaction.options.getSubcommand() === "poll") {
			pollInteraction(interaction);
		}

	},
};

export default send;