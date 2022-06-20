import { MessageEmbed } from "discord.js";
import { CustomCommand } from "../../exports/types";
import * as data from "../../exports/data";

let help: CustomCommand = {
	data: {
		name: "help",
		description: "See documentation about my commands and find my support server!",
	},

	async modalExecute(interaction) {

	},

	async execute(interaction) {
		data.commandUsed("help");
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("#389af0")
					.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/message.png?raw=true")
					.setTitle("/send message < Title > < Description > [ Ping Group ] [ Image URL ]")
					.setDescription("Send a fancy message!")
					.addFields(
						{
							name: "`Title`",
							value: "Type in a word or phrase that is less than 256 characters."
						},
						{
							name: "`Description`",
							value: "Type in a main description that is less than 4000 characters. Use `\\n\` to create an enter, `\\u200A` to create an empty feild, and to create a link, type `( Your Text )[ URL ]`"
						},
						{
							name: "`Image`",
							value: "Type in a link to an image."
						},
						{
							name: "`Ping Group`",
							value: "Select who you want to ping with the message."
						},
					),
				//.setImage("https://cdn.discordapp.com/attachments/945889704375627807/946566904187875388/send-command.gif") Finding a new alternative for img urls, as Discord deletes old images.
				new MessageEmbed()
					.setColor("#389af0")
					.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/poll.png?raw=true")
					.setTitle("/send poll < Question > < Option 1 > < Option 2 > [ Option 3 ] [ Option 4 ] [ Ping Group ] < Live Results >")
					.setDescription("Send a simple, anonymous poll! Polls are open for 1 day.")
					.addFields(
						{
							name: "`Question`",
							value: "Type in the poll question in less than 256 characters. Use `\\n\` to create an enter, `\\u200B` to create an empty feild, and to create a link, type `( Your Text )[ URL ]`"
						},
						{
							name: "`Question 1`",
							value: "Type in a response to your question that is less than 80 characters."
						},
						{
							name: "`Question 2`",
							value: "Type in a response to your question that is less than 80 characters."
						},
						{
							name: "`Question 3`",
							value: "Type in a response to your question that is less than 80 characters."
						},
						{
							name: "`Question 4`",
							value: "Type in a response to your question that is less than 80 characters."
						},
						{
							name: "`Ping Group`",
							value: "Select who you want to ping with the message."
						},
						{
							name: "`Live Results`",
							value: "Decide if poll should show results as users vote. Results will always be shown after the poll is over."
						},
					),
				new MessageEmbed()
					.setColor("#389af0")
					.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/giveaway.png?raw=true")
					.setTitle("/send giveaway < Item > < # of Winners > [ Ping Group ] [ Required Input ]")
					.setDescription("Send a quick and rich giveaway! Giveaways are open for 1 day.")
					.addFields(
						{
							name: "`Item`",
							value: "Type in the item you would like to give away in less than 200 charicters."
						},
						{
							name: "`# of Winners`",
							value: "Type in how many people you would like to win the giveaway (1-100)."
						},
						{
							name: "`Ping Group`",
							value: "Select who you want to ping with the message."
						},
						{
							name: "`Required Input`",
							value: "Type in what information users must provide in less than 80 characters."
						},
					),
				new MessageEmbed()
					.setColor("#389af0")
					.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/info.png?raw=true")
					.setTitle("/info")
					.setDescription("Get information about the bot!"),
			],
			ephemeral: true,
		});
	},
};

export default help;
