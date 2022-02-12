import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { CustomCommand } from "../exports/types";

let help: CustomCommand = {
	data: {
		name: "help",
		description: "See documentation about my commands and find my support server!",
	},
	async execute(interaction) {
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("#389af0")
					.setTitle("/send announcement < Title > [ Link ] [ Description ]")
					.addFields(
						// {
						// 	name: "`Header`",
						// 	value: "Type in a short world or phrase that is less than 255 charicters."
						// },
						//{ name: "\u200B", value: "\u200B" },
						{
							name: "`Title`",
							value: "This is a required field. Type in a word or phrase that is less than 255 charicters."
						},
						//{ name: "\u200B", value: "\u200B" },
						{
							name: "`Link`",
							value: "Type in a link. The link provided here will be applied to the title."
						},
						//{ name: "\u200B", value: "\u200B" },
						{
							name: "`Description`",
							value: "Type in a main description. To create a tab, use `\\t`. To make a line enter, use `\\n`. To add a link to a specific word, type `Your_Word_Here[Your_Link_Here]`."
						},
					),
				// new MessageEmbed()
				// 	.setColor("#389af0")
				// 	.setTitle("/send warning < Title > [ Description ]")
				// 	.addFields(
				// 		{
				// 			name: "`Title`",
				// 			value: "This is a required field. Type in a word or phrase that is less than 255 charicters."
				// 		},
				// 		//{ name: "\u200B", value: "\u200B" },
				// 		{
				// 			name: "`Description`",
				// 			value: "Type in a main description. To create a tab, use `\\t`. To make a line enter, use `\\n`. To add a link to a specific word, type `Your_Word_Here[Your_Link_Here]`."
				// 		},
				// 	),
				new MessageEmbed()
					.setColor("#389af0")
					.setTitle("/send poll < Title > [ Link ] [ Description ] < Options >")
					.addFields(
						{
							name: "`Title`",
							value: "This is a required field. Type in a word or phrase that is less than 255 charicters."
						},
						//{ name: "\u200B", value: "\u200B" },
						{
							name: "`Link`",
							value: "Type in a link. The link provided here will be applied to the title."
						},
						//{ name: "\u200B", value: "\u200B" },
						{
							name: "`Description`",
							value: "Type in a main description. To create a tab, use `\\t`. To make a line enter, use `\\n`. To add a link to a specific word, type `Your_Word_Here[Your_Link_Here]`."
						},
						{
							name: "`Options`",
							value: "Type in up to 5 options for users to pick from."
						},
					)
			],
			components: [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setLabel("Support Server")
							.setStyle("LINK")
							.setURL("https://google.com")
						//.setCustomId("server")
					)
			],
			ephemeral: true,
		});
	},
};

export default help;
