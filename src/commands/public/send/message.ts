import {
	MessageEmbed,
	Role,
} from "discord.js";
import sendUpdate from "../../../exports/send_update";
import { client } from "../../../exports/client";
import * as buttons from "../../../exports/send_buttons";
import * as questionEmbeds from "../../../exports/question_embeds";
import logMessage from "../../../exports/error";
import * as data from "../../../exports/data";

export default async function messageInteraction(interaction) {
	try {
		data.commandUsed("message");
		//Inputs ---
		let title: string = interaction.options.getString("title");
		let description = interaction.options.getString("description");
		let image: string = "";
		let ping: string = "";

		if (interaction.options.getString("image") && interaction.options.getString("image").match(/^((https:\/\/)|(http:\/\/))\w{2,100}(\.{1,10}\w{1,100}){1,100}(\/\w{0,100}){0,100}/gm)) image = interaction.options.getString("image");

		if (title.length > 256) title = title.slice(0, 256);
		if (description.length > 3998) description = description.slice(0, 3998);

		try {
			description = JSON.parse('"' + description.replace(/"/g, '\\"') + '"');
		} catch { }
		try {
			title = JSON.parse('"' + title.replace(/"/g, '\\"') + '"');
		} catch { }

		if (image == "" && interaction.user.id != process.env.OWNER_ID) description += "\n" + "\u200b";
		if (description.match(/^[\n\u2800\u200b\s]*$/s)) {
			if (image == "") {
				description = "\n\u200b"
			} else {
				description = "";
			}
		}

		//Embed
		let userMessage;
		if (interaction.user.id == process.env.OWNER_ID) {
			userMessage = new MessageEmbed()
				.setColor("#2f3136")
				.setTitle(title)
				.setDescription(description)
				.setImage(image)
		} else {
			userMessage = new MessageEmbed()
				.setColor("#2f3136")
				.setTitle(title)
				.setDescription(description)
				.setImage(image)
				.setFooter({ text: "Sent by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
		}

		if (interaction.options.getMentionable("ping-group")) {
			if (interaction.options.getMentionable("ping-group").name == "@everyone") {
				ping = "@everyone";
			} else if (!(interaction.options.getMentionable("ping-group") as Role).members) {
				ping = "<@" + interaction.options.getMentionable("ping-group") + ">"
			} else {
				ping = "<@&" + interaction.options.getMentionable("ping-group") + ">"
			}
		}

		//Other Variables
		let updateSent = false;
		let uuid = interaction.id;

		//Send Preview ---
		if (ping == "") {
			await interaction.reply({
				embeds: [questionEmbeds.question("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/send/ready_to_send.png?raw=true", ""), userMessage],
				components: [buttons.buttonRow(uuid)],
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: ping,
				embeds: [questionEmbeds.question("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/send/ready_to_send.png?raw=true", ""), userMessage],
				components: [buttons.buttonRow(uuid)],
				ephemeral: true,
			});
		}


		//Start Collector ---
		let collector = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000 });
		collector.on("collect", async (i) => {

			//Send
			if (i.customId === uuid + "::send") {
				data.buttonUsed("message", "send");
				sendUpdate(i);
				try {
					if (ping == "") {
						await (client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
							embeds: [userMessage],
						});
					} else {
						await (client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
							content: ping,
							embeds: [userMessage],
						});
					}

					await interaction.editReply({
						embeds: [questionEmbeds.send, userMessage],
						components: [buttons.buttonRowDisabled(uuid)],
					});
				} catch {
					await interaction.editReply({
						embeds: [questionEmbeds.invalidPerms, userMessage],
						components: [buttons.buttonRowDisabled(uuid)],
					});
				}
				updateSent = true;

				//Cancel
			} else if (i.customId === uuid + "::cancel") {
				data.buttonUsed("message", "cancel");
				sendUpdate(i);
				await interaction.editReply({
					embeds: [questionEmbeds.cancel, userMessage],
					components: [buttons.buttonRowDisabled(uuid)],
				});
				updateSent = true;
			}
		});
		//Timed Out ---
		collector.on("end", async i => {
			if (updateSent) return;
			await interaction.editReply({
				embeds: [questionEmbeds.timedOut, userMessage],
				components: [buttons.buttonRowDisabled(uuid)],
			});
		})
	} catch (error) {
		logMessage(error, "/send message command", interaction);
	}
}