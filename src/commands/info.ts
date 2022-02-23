import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { CustomCommand } from "../exports/types";

let info: CustomCommand = {
	data: {
		name: "info",
		description: "See information about me!",
	},
	async execute(interaction) {
		await interaction.reply({
			// embeds: [
			// 	new MessageEmbed()
			// 		.setColor("#389af0")
			// 		.setTitle("Embeds bot")
			// ],
			components: [
				new MessageActionRow()
					.addComponents(
						new MessageButton()
							.setLabel("Support Server")
							.setStyle("LINK")
							.setURL("https://google.com"),
						new MessageButton()
							.setLabel("Add to Server")
							.setStyle("LINK")
							.setURL("https://discord.com/oauth2/authorize?client_id=942083941307912193&scope=bot%20applications.commands&permissions=18432"),
						new MessageButton()
							.setLabel("Github")
							.setStyle("LINK")
							.setURL("https://github.com/chr0mevillager/embed-bot"),
					)
			],
			ephemeral: true,
		});
	},
};

export default info;
