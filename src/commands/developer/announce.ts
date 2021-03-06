import { MessageEmbed } from "discord.js";
import { CustomCommand } from "../../exports/types";
import * as announceMessage from "../../exports/announce";
import * as colors from "../../exports/colors"

let announce: CustomCommand = {
	data: {
		name: "announce",
		description: "Make an announcement!",
		options: [
			{
				name: "message",
				description: "Send a new announcement message",
				type: 1,
				options: [
					{
						name: "title",
						description: "Set the title of the announcement.",
						type: "STRING",
						required: true,
					},
					{
						name: "description",
						description: "Set the description of the announcement.",
						type: "STRING",
						required: true,
					},
					{
						name: "button_title",
						description: "Set the title of the announcement's button.",
						type: "STRING",
						required: false,
					},
					{
						name: "button_link",
						description: "Set the link of the announcement's button.",
						type: "STRING",
						required: false,
					}
				]
			},
			{
				name: "reset",
				description: "Reset the announcement message.",
				type: 1,
			},
		],
	},

	async execute(interaction) {
		if (interaction.options.getSubcommand() === "message") {
			if (interaction.options.getString("button_title")) {
				announceMessage.updateAnnouncement(interaction.options.getString("title"), interaction.options.getString("description"), interaction.options.getString("button_title"), interaction.options.getString("button_link"));
				interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle("Announcement Sent")
							.setColor(colors.successColor)
							.setDescription("Title:```" + announceMessage.announcement.title + "```Description:```" + announceMessage.announcement.description + "```Button:```" + announceMessage.announcement.button.title + "\n\n" + announceMessage.announcement.button.link + "```"),
					],
					ephemeral: true,
				});
			} else {
				announceMessage.updateAnnouncement(interaction.options.getString("title"), interaction.options.getString("description"));
				interaction.reply({
					embeds: [
						new MessageEmbed()
							.setTitle("Announcement Sent")
							.setColor(colors.successColor)
							.setDescription("Title:```" + announceMessage.announcement.title + "```Description:```" + announceMessage.announcement.description + "```"),
					],
					ephemeral: true,
				});
			}
		} else if (interaction.options.getSubcommand() === "reset") {
			announceMessage.resetAnnouncement();
			interaction.reply({
				embeds: [
					new MessageEmbed()
						.setTitle("Announcements Reset")
						.setColor(colors.successColor)
				],
				ephemeral: true,
			});
		}
	},
};

export default announce;