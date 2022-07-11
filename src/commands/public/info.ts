import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { commandData, CustomCommand } from "../../exports/types";
import * as profileInfo from "../../exports/profile_info";
import * as colors from "../../exports/colors";
import * as inviteURL from "../../exports/invite_url";

let info: CustomCommand = {
	data: {
		name: "info",
		description: "See information about me!",
		type: "CHAT_INPUT",
	},

	commandHelp: {
		name: "info",
		module: "general",
		keywords: [
			"info",
			"detail",
			"data",
			"general",
		],
		helpMessage: new MessageEmbed()
			.setThumbnail("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/command_icons/info.png?raw=true")
			.setColor(colors.clearColor)
			.setTitle("Info")
			.setDescription("```Get information about me!```"),
	},

	commandData: {
		uses: 0,
	},

	async execute(interaction) {
		(info.commandData as commandData).uses++;
		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor(colors.clearColor)
					.setTitle("")
					.setDescription("")
					.setImage("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/banners/info.png?raw=true"),

				new MessageEmbed()
					.setColor(colors.clearColor)
					.setTitle("Coyote#7040")
					.setDescription("Run `/help` for help.\n\nRun `/permissions` for permission information.")
					.addFields(
						{
							name: "Version",
							value: "```\n" + profileInfo.versionNumber.replaceAll(".", ".\n") + "```",
							inline: true,
						},
						{
							name: "Release Notes",
							value: "```\n" + profileInfo.releaseNotes + "```",
							inline: true,
						},
						{
							name: "Features",
							value: "```\n" + profileInfo.featureText + "```",
							inline: true,
						},
					)
			],
			components: [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setLabel("Add to Server")
							.setStyle("LINK")
							.setURL(inviteURL.inviteURL + inviteURL.permissions.everything),
						// new MessageButton()
						// 	.setLabel("Support Server")
						// 	.setStyle("LINK")
						// 	.setURL("https://google.com"),
						new MessageButton()
							.setLabel("Github")
							.setStyle("LINK")
							.setURL("https://github.com/chr0mevillager/coyote"),
					)
			],
			ephemeral: true,
		});
	},
};

export default info;
