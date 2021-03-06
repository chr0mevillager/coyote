import {
	MessageEmbed,
	Role,
} from "discord.js";
import sendUpdate from "../../../exports/send_update";
import { client } from "../../../exports/client";
import * as buttons from "../../../exports/send_buttons";
import * as questionEmbeds from "../../../exports/question_embeds";
import logMessage from "../../../exports/error";
import { commandData, commandHelp } from "src/exports/types";
import * as colors from "../../../exports/colors";

export const help: commandHelp = {
	name: "message",
	fullName: "/send message",
	module: "embeds",
	keywords: [
		"message",
		"text",
		"word",
		"embed",
		"note",
		"email",
		"memo",
		"communication",
		"send",
		"imag",
	],
	helpMessage: new MessageEmbed()
		.setThumbnail("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/command_icons/message.png?raw=true")
		.setColor(colors.clearColor)
		.setTitle("Message")
		.setDescription("Send a fancy message!\n\n```/send message < Title > < Description > [ Ping Group ] [ Image URL ]```")
		.addFields(
			{
				name: "Title",
				value: "```Type in a word or phrase that is less than 256 characters.```",
				inline: true,
			},
			{
				name: "Image",
				value: "```Type in a link to an image.\n\n\n\u200b```",
				inline: true,
			},
			{
				name: "Ping Group",
				value: "```Select who you want to ping with the message.\n\u200b```",
				inline: true,
			},
			{
				name: "Description",
				value: "```Type in a main description that is less than 4000 characters. Use \\n\ to create an enter, \\u200b to create an empty feild, and to create a link, type ( Your Text )[ URL ]```",
				inline: true,
			},
		),
}

export const info: commandData = {
	uses: 0,
	buttons: {
		send: 0,
		cancel: 0,
	},
}

export async function interaction(interaction) {
	try {
		info.uses++;
		//Inputs ---
		let title: string = interaction.options.getString("title");
		let description = interaction.options.getString("description");
		let image: string = "";
		let ping: string = "";

		if (interaction.options.getString("image") && interaction.options.getString("image").match(/^((https:\/\/)|(http:\/\/))[a-z A-Z 1-9]+\.[a-z A-Z 1-9]+/gm)) image = interaction.options.getString("image");

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
				.setColor(colors.clearColor)
				.setTitle(title)
				.setDescription(description)
				.setImage(image)
		} else {
			userMessage = new MessageEmbed()
				.setColor(colors.clearColor)
				.setTitle(title)
				.setDescription(description)
				.setImage(image)
				.setFooter({ text: "Sent by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
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
				embeds: [questionEmbeds.question("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/send/ready_to_send.png?raw=true", ""), userMessage],
				components: [buttons.buttonRow(uuid)],
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: ping,
				embeds: [questionEmbeds.question("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/send/ready_to_send.png?raw=true", ""), userMessage],
				components: [buttons.buttonRow(uuid)],
				ephemeral: true,
			});
		}


		//Start Collector ---
		let collector = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000, max: 1 });
		collector.on("collect", async (i) => {

			//Send
			if (i.customId === uuid + "::send") {
				updateSent = true;
				info.buttons["send"]++;
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

				//Cancel
			} else if (i.customId === uuid + "::cancel") {
				updateSent = true;
				info.buttons["cancel"]++;
				sendUpdate(i);
				await interaction.editReply({
					embeds: [questionEmbeds.cancel, userMessage],
					components: [buttons.buttonRowDisabled(uuid)],
				});
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