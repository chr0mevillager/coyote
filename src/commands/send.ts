import logMessage from "../exports/error";
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
						description: "What do you want the message to be titled? (>256 charicters)",
						type: 3,
						required: true,
					},
					{
						name: "description",
						description: "What do you want the description to be? (>4000 charicters)",
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
						description: "What do you want the message to be titled? (>256 charicters)",
						type: 3,
						required: true,
					},
					{
						name: "option-1",
						description: "What should the first option be? (>80 charicters)",
						type: 3,
						required: true,

					},
					{
						name: "option-2",
						description: "What should the second option be? (>80 charicters)",
						type: 3,
						required: true,
					},
					{
						name: "visible-results",
						description: "Should users be able to see the total number of votes during or after the poll?",
						type: "BOOLEAN",
						required: true,
					},
					{
						name: "option-3",
						description: "What should the third option be? (>80 charicters)",
						type: 3,
						required: false,
					},
					{
						name: "option-4",
						description: "What should the fourth option be? (>80 charicters)",
						type: 3,
						required: false,
					},
				]
			},
		],
	},

	async execute(interaction) {
		if (interaction.options.getSubcommand() === "message") {
			try {
				messageInteraction(interaction);
			} catch (error) {
				logMessage(error, "/send message command", interaction);
				return;
			}
		} else if (interaction.options.getSubcommand() === "poll") {
			try {
				pollInteraction(interaction);
			} catch (error) {
				logMessage(error, "/send poll command", interaction);
				return;
			}
		}

	},
};

export default send;