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
							value: "Type in a word or phrase that is less than 200 charicters."
						},
						{
							name: "`Description`",
							value: "Type in a main description that is less than 4000 charicters."
						},
						{
							name: "`Image`",
							value: "Type in a link to an image."
						},
					),
				new MessageEmbed()
					.setColor("#389af0")
					.setTitle("/info")
					.setDescription("Get information about the bot!")
			],
			components: [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setLabel("Support Server")
							.setStyle("LINK")
							.setURL("https://google.com")
					)
			],
			ephemeral: true,
		});
	},
};

export default help;
