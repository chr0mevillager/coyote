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
					.setTitle("/send announcement < Title > < Description > [ Image URL ]")
					.setDescription("Send a fancy message!")
					.addFields(
						{
							name: "`Title`",
							value: "Type in a word or phrase that is less than 256 charicters."
						},
						{
							name: "`Description`",
							value: "Type in a main description that is less than 4000 charicters. Use `\\n\` to create an enter, `\\u2800` to create an empty feild, and to create a link, type `( Your Text )[ URL ]`"
						},
						{
							name: "`Image`",
							value: "Type in a link to an image."
						},
					),
				//.setImage("https://cdn.discordapp.com/attachments/945889704375627807/946566904187875388/send-command.gif") Finding a new alternative for img urls, as Discord deletes old images.
				new MessageEmbed()
					.setColor("#389af0")
					.setTitle("/send poll < Question > < Option 1 > < Option 2 > [ Option 3 ] [ Option 4 ] < Visible Results >")
					.setDescription("Send a simple, anonymous poll! Polls are open for 1 day.")
					.addFields(
						{
							name: "`Question`",
							value: "Type in the poll question in less than 256 charicters. Use `\\n\` to create an enter, `\\u2800` to create an empty feild, and to create a link, type `( Your Text )[ URL ]`"
						},
						{
							name: "`Question 1`",
							value: "Type in a response to your question that is less than 100 charicters."
						},
						{
							name: "`Question 2`",
							value: "Type in a response to your question that is less than 100 charicters."
						},
						{
							name: "`Question 3`",
							value: "Type in a response to your question that is less than 100 charicters."
						},
						{
							name: "`Question 4`",
							value: "Type in a response to your question that is less than 100 charicters."
						},
						{
							name: "`Visible Results`",
							value: "Decide if poll should show its results live or after the poll is complete."
						},
					),
				new MessageEmbed()
					.setColor("#389af0")
					.setTitle("/info")
					.setDescription("Get information about the bot!"),
			],
			// components: [
			// 	new MessageActionRow()
			// 		.addComponents(
			// 			new MessageButton()
			// 				.setLabel("Support Server")
			// 				.setStyle("LINK")
			// 				.setURL("https://google.com")
			// 		)
			// ],
			ephemeral: true,
		});
	},
};

export default help;
