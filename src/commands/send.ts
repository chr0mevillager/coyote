import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	CommandInteraction,
	CacheType,
	InteractionCollector,
	MessageComponentInteraction,
	GuildMember,
	TextChannel,
} from "discord.js";
import { CustomCommand } from "../exports/types";
import { client } from "../exports/client";
import { v4 as uuidv4 } from "uuid";
import messageInteraction from "./send_interactions/message";

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
						type: "STRING",
						required: true,
					},
					{
						name: "description",
						description: "What do you want the description to be? (>4000 charicters)",
						type: "STRING",
						required: true,
					},
					{
						name: "image",
						description: "What do you want the image to be? (Link)",
						type: "STRING",
						required: false,
					},
				]
			},

		],
	},

	async execute(interaction) {
		if (interaction.options.getSubcommand() === "message") {
			messageInteraction(interaction);
		}
	},
};

export default send;