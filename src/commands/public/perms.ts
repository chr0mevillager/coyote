import { MessageEmbed } from "discord.js";
import { CustomCommand } from "../../exports/types";
import permissions from "../../exports/perms";

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
			.setColor("#2f3136")
	},

	commandData: {
		uses: 0,
	},

	async execute(interaction) {
		let permissionMessages = Object.values(permissions);
		permissionMessages.unshift(
			new MessageEmbed()
				.setColor("#389af0")
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