import {
	ColorResolvable,
	MessageEmbed,
} from "discord.js";
import sendUpdate from "../../exports/send_update";
import { client } from "../../exports/client";
import * as buttons from "../../exports/send_buttons";
import * as questionEmbeds from "../../exports/question_embeds";
import logMessage from "../../exports/error";

export default async function messageInteraction(interaction) {

	try {
		//Inputs ---
		let title: string = "\u200B";
		let description = "";
		let image: string = "";

		title = interaction.options.getString("title");
		description = interaction.options.getString("description");
		if (interaction.options.getString("image") && interaction.options.getString("image").match(/^((https:\/\/)|(http:\/\/))\w{2,100}(\.{1,10}\w{1,100}){1,100}(\/\w{0,100}){0,100}/gm)) image = interaction.options.getString("image");

		if (title.length > 256) title = title.slice(0, 256);
		if (description.length > 3998) description = description.slice(0, 3998);

		try {
			description = JSON.parse('"' + description.replace(/"/g, '\\"') + '"');
		} catch { }
		try {
			title = JSON.parse('"' + title.replace(/"/g, '\\"') + '"');
		} catch { }

		if (image == "") description += "\n" + "\u200B";
		if (description.match(/^[\n\u2800\u200b\s]*$/s)) {
			if (image == "") {
				description = "\n\u200B"
			} else {
				description = "";
			}
		}

		//Other Variables
		let updateSent = false;
		let uuid = interaction.id;

		//Embed
		const userMessage = (color: string) => new MessageEmbed()
			.setColor(color as ColorResolvable)
			.setTitle(title)
			.setDescription(description)
			.setImage(image)
			.setFooter({ text: "Sent by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })


		//Send Preview ---
		await interaction.reply({
			embeds: [questionEmbeds.question("Message"), userMessage("#2f3136")],
			components: [buttons.buttonRow(uuid)],
			ephemeral: true,
		});

		//Start Collector ---
		let collector = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000 });
		collector.on("collect", async (i) => {

			//Send
			if (i.customId === uuid + "::send") {
				try {
					await (client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
						embeds: [userMessage("#2f3136")],
					});

					await interaction.editReply({
						embeds: [questionEmbeds.send, userMessage("#2f3136")],
						components: [buttons.buttonRowDisabled(uuid)],
					});
				} catch {
					await interaction.editReply({
						content: "\u200B",
						embeds: [questionEmbeds.invalidPerms, userMessage("#2f3136")],
						components: [buttons.buttonRowDisabled(uuid)],
					});
				}
				sendUpdate(i, updateSent);

				//Cancel
			} else if (i.customId === uuid + "::cancel") {
				await interaction.editReply({
					embeds: [questionEmbeds.cancel, userMessage("#2f3136")],
					components: [buttons.buttonRowDisabled(uuid)],
				});
				sendUpdate(i, updateSent);
			}
		});
		//Timed Out ---
		collector.on("end", async i => {
			if (updateSent) return;
			await interaction.editReply({
				embeds: [questionEmbeds.timedOut, userMessage("#2f3136")],
				components: [buttons.buttonRowDisabled(uuid)],
			});
		})
	} catch (error) {
		logMessage(error, "/send message command", interaction);
	}
}