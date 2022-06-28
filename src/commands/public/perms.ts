import { MessageEmbed } from "discord.js";
import { CustomCommand } from "../../exports/types";
import permissions from "../../exports/perms";
import * as colors from "../../exports/colors";

let perms: CustomCommand = {
	data: {
		name: "permissions",
		description: "See what permissions I need!",
	},

	commandHelp: {
		name: "permissions",
		keywords: [
			"perm",
			"work",
		],
		module: "general",
		helpMessage: new MessageEmbed()
			.setTitle("Permissions")
			.setDescription("```See what permissions I need!```")
			.setColor(colors.clearColor)
	},

	commandData: {
		uses: 0,
	},

	async execute(interaction) {
		let permissionMessages = Object.values(permissions);
		permissionMessages.unshift(
			new MessageEmbed()
				.setColor(colors.mainColor)
				.setTitle("Want to Forget Permissions?")
				.setDescription("```ts\nGive me the \"Administrator\" permission and never worry about it again, even after new feature releases!```")
		);

		interaction.reply({
			embeds: permissionMessages,
			ephemeral: true,
		});
	},
};

export default perms;