import { MessageEmbed } from "discord.js";
import { commandData, CustomCommand } from "../../exports/types";
import permissions from "../../exports/perms";
import * as colors from "../../exports/colors";
import * as inviteURL from "../../exports/invite_url";

let permissionMessages = Object.values(permissions);
permissionMessages.unshift(
	new MessageEmbed()
		.setColor(colors.clearColor)
		.setTitle("Want to Forget Permissions?")
		.setDescription("```js\nTo automatically update my permissions, select on one of the links below, select this server, select \"Authorize\".```")
		.addFields([
			{
				name: "Admin Permission",
				value: "[Update Permissions](" + inviteURL.inviteURL + inviteURL.permissions.admin + ")```ts\nGive me the \"Administrator\" permission and never worry about it again, even after new feature releases!```",
				inline: true,
			},
			{
				name: "Necessary Permissions",
				value: "[Update Permissions](" + inviteURL.inviteURL + inviteURL.permissions.main + ")```ts\nGive me my necessary permissions to keep me operating properly.\n\u200b```",
				inline: true,
			},
		])
);
permissionMessages.unshift(
	new MessageEmbed()
		.setColor(colors.clearColor)
		.setTitle("")
		.setDescription("")
		.setImage("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/banners/perms.png?raw=true")
);

let perms: CustomCommand = {
	data: {
		name: "permissions",
		description: "See what permissions I need!",
		type: "CHAT_INPUT",
	},

	commandHelp: {
		name: "permissions",
		keywords: [
			"perm",
			"work",
		],
		module: "general",
		helpMessage: new MessageEmbed()
			.setThumbnail("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/command_icons/perms.png?raw=true")
			.setTitle("Permissions")
			.setDescription("```See what permissions I need!```")
			.setColor(colors.clearColor)
	},

	commandData: {
		uses: 0,
	},

	async execute(interaction) {
		(perms.commandData as commandData).uses++;

		await interaction.reply({
			embeds: permissionMessages,
			ephemeral: true,
		});
	},
};

export default perms;