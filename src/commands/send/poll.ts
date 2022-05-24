import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	Role,
} from "discord.js";
import { client } from "../../exports/client";
import generateTimeStamp from "../../exports/timestamp";
import * as buttons from "../../exports/send_buttons";
import sendUpdate from "../../exports/send_update";
import * as questionEmbeds from "../../exports/question_embeds";
import logMessage from "../../exports/error";
import * as mode from "../../exports/mode";

export default async function pollInteraction(interaction) {

	try {
		//Inputs ---
		let question: string = interaction.options.getString("question");
		let results: string = "\u200B";
		let visibleResults = interaction.options.getBoolean("visible-results");
		let ping: string = "";

		if (question.length > 256) question = question.slice(0, 256);
		try {
			question = JSON.parse('"' + question.replace(/"/g, '\\"') + '"');
		} catch { }

		//Poll Results
		let pollResponses1 = 0;
		let pollResponses2 = 0;
		let pollResponses3 = 0;
		let pollResponses4 = 0;
		let responders = [];

		//Other Variables
		let updateSent = false;
		let timeToClose = generateTimeStamp(1, 0, 0);
		let uuid = interaction.id;
		let pollMessage;
		let pollOver;

		const responseMessage = new MessageEmbed()
			.setColor("#3aef3a")
			.setTitle("Entered Poll")
			.setDescription("Your poll results have been saved.\n\nRemember, you can only vote once.")
			.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/poll.png?raw=true")

		const deniedResponseMessage = new MessageEmbed()
			.setColor("#ff6c08")
			.setTitle("You can Only Enter a Poll Once")
			.setDescription("Your poll results have already been saved.")
			.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/poll.png?raw=true")

		let previewResults;
		if (visibleResults) {
			previewResults = "```Poll results will appear here.```";
		} else {
			previewResults = "```Poll results will appear here after the poll closes.```";
		}

		//Poll Buttons
		let pollButton1: string = interaction.options.getString("option-1");
		let pollButton2: string = interaction.options.getString("option-2");
		let pollButton3;
		let pollButton4;

		pollButton1 = JSON.parse('"' + pollButton1.replace(/"/g, '\\"') + '"');
		pollButton2 = JSON.parse('"' + pollButton2.replace(/"/g, '\\"') + '"');

		if (pollButton1.length > 80) pollButton1 = pollButton1.slice(0, 80);
		if (pollButton2.length > 80) pollButton2 = pollButton2.slice(0, 80);

		const pollButtonRow1 = (uuid: string) => new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(uuid + "::pollButton1")
					.setLabel(pollButton1)
					.setStyle("PRIMARY")
			);
		const pollButtonRow2 = (uuid: string) => new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(uuid + "::pollButton2")
					.setLabel(pollButton2)
					.setStyle("PRIMARY")
			);

		let pollButtonRow3;
		let button3exists = false;
		let pollButtonRow4;
		let button4exists = false;

		let pollButtons = [
			pollButtonRow1(uuid),
			pollButtonRow2(uuid),
		];

		if ((interaction.options.getString("option-3")) != null && (interaction.options.getString("option-3")) != undefined) {
			button3exists = true;
			pollButton3 = interaction.options.getString("option-3");
			if (pollButton3.length > 80) pollButton3 = pollButton3.slice(0, 80);
			pollButton3 = JSON.parse('"' + pollButton3.replace(/"/g, '\\"') + '"');

			pollButtonRow3 = (uuid: string) => new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(uuid + "::pollButton3")
						.setLabel(pollButton3)
						.setStyle("PRIMARY")
				);
			pollButtons.push(pollButtonRow3(uuid));
		}

		if ((interaction.options.getString("option-4")) != null && (interaction.options.getString("option-4")) != undefined) {
			button4exists = true;
			pollButton4 = interaction.options.getString("option-4");
			if (pollButton4.length > 80) pollButton4 = pollButton4.slice(0, 80);
			pollButton4 = JSON.parse('"' + pollButton4.replace(/"/g, '\\"') + '"');

			pollButtonRow4 = (uuid: string) => new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(uuid + "::pollButton4")
						.setLabel(pollButton4)
						.setStyle("PRIMARY")
				);
			pollButtons.push(pollButtonRow4(uuid));
		}

		//Embed
		let poll;
		if (interaction.user.id == process.env.OWNER_ID) {
			poll = (votingResults: string) => new MessageEmbed()
				.setColor("#2f3136")
				.setTitle(question)
				.setDescription(votingResults + "\n" + "🕑  Closes <t:" + timeToClose + ":R>")
		} else {
			poll = (votingResults: string) => new MessageEmbed()
				.setColor("#2f3136")
				.setTitle(question)
				.setDescription(votingResults + "\n" + "🕑  Closes <t:" + timeToClose + ":R>")
				.setFooter({ text: "Poll made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
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

		//Send Preview ---
		if (ping == "") {
			await interaction.reply({
				embeds: [questionEmbeds.question(mode.image, mode.description), poll(previewResults)],
				components: [buttons.buttonRow(uuid)],
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: ping,
				embeds: [questionEmbeds.question(mode.image, mode.description), poll(previewResults)],
				components: [buttons.buttonRow(uuid)],
				ephemeral: true,
			});
		}

		//Start Collector 1 --
		let collector1 = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::pollButton1` || i.customId === `${uuid}::pollButton2` || i.customId === `${uuid}::pollButton3` || i.customId === `${uuid}::pollButton4` || i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000 });
		collector1.on("collect", async (i) => {

			//Send
			if (i.customId === uuid + "::send") {
				sendUpdate(i);
				//Change Message for Result Visibility
				if (visibleResults) {
					results = "```No votes yet.```";
				} else {
					results = "\u2800\n\u2800";
				}
				try {
					if (ping == "") {
						await (client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
							embeds: [poll(results)],
							components: pollButtons,
						}).then(sentMessage => {
							pollMessage = sentMessage;
						});
					} else {
						await (client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
							content: ping,
							embeds: [poll(results)],
							components: pollButtons,
						}).then(sentMessage => {
							pollMessage = sentMessage;
						});
					}

					if (ping == "") {
						await interaction.editReply({
							embeds: [questionEmbeds.send, poll(previewResults)],
							components: [
								buttons.buttonRowDisabled(uuid),
							],
						});
					} else {
						await interaction.editReply({
							content: ping,
							embeds: [questionEmbeds.send, poll(previewResults)],
							components: [
								buttons.buttonRowDisabled(uuid),
							],
						});
					}
					startPoll();
				} catch {
					await interaction.editReply({
						embeds: [questionEmbeds.invalidPerms, poll(previewResults)],
						components: [
							buttons.buttonRowDisabled(uuid),
						],
					});
				}
				updateSent = true;

				//Cancel
			} else if (i.customId === uuid + "::cancel") {
				sendUpdate(i);
				if (ping == "") {
					await interaction.editReply({
						embeds: [
							questionEmbeds.cancel,
							new MessageEmbed()
								.setColor("#2f3136")
								.setTitle(question)
								.setDescription(results + "\n" + "🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ">")
								.setFooter({ text: "Poll made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
						],
						components: [
							buttons.buttonRowDisabled(uuid),
						],
					});
				} else {
					await interaction.editReply({
						content: ping,
						embeds: [
							questionEmbeds.cancel,
							new MessageEmbed()
								.setColor("#2f3136")
								.setTitle(question)
								.setDescription(results + "\n" + "🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ">")
								.setFooter({ text: "Poll made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
						],
						components: [
							buttons.buttonRowDisabled(uuid),
						],
					});
				}
			}
		});

		collector1.on("end", async i => {
			if (updateSent) return;
			if (ping == "") {
				await interaction.editReply({
					embeds: [
						questionEmbeds.timedOut,
						new MessageEmbed()
							.setColor("#2f3136")
							.setTitle(question)
							.setDescription(previewResults + "\n" + "🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ">")
							.setFooter({ text: "Poll made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
					],
					components: [
						buttons.buttonRowDisabled(uuid),
					],
				});
			} else {
				await interaction.editReply({
					content: ping,
					embeds: [
						questionEmbeds.timedOut,
						new MessageEmbed()
							.setColor("#2f3136")
							.setTitle(question)
							.setDescription(previewResults + "\n" + "🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ">")
							.setFooter({ text: "Poll made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
					],
					components: [
						buttons.buttonRowDisabled(uuid),
					],
				});
			}
		})

		async function startPoll() {

			//Collector 2 --
			let collector2 = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::pollButton1` || i.customId === `${uuid}::pollButton2` || i.customId === `${uuid}::pollButton3` || i.customId === `${uuid}::pollButton4` || i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 86400000 });

			collector2.on("collect", async (i) => {
				if (pollOver) return;
				if (i.customId === uuid + "::pollButton1") {
					if (responders.includes(i.user.id)) {
						i.reply({
							embeds: [deniedResponseMessage],
							ephemeral: true,
						});
						return;
					}
					i.reply({
						embeds: [responseMessage],
						ephemeral: true,
					});
					pollResponses1++;
					responders.push(i.user.id);
					if (visibleResults && !pollOver) updateMessage(true);
				} else if (i.customId === uuid + "::pollButton2") {
					if (responders.includes(i.user.id)) {
						i.reply({
							embeds: [deniedResponseMessage],
							ephemeral: true,
						});
						return;
					}
					i.reply({
						embeds: [responseMessage],
						ephemeral: true,
					});
					pollResponses2++;
					responders.push(i.user.id);
					if (visibleResults && !pollOver) updateMessage(true);
				} else if (i.customId === uuid + "::pollButton3") {
					if (responders.includes(i.user.id)) {
						i.reply({
							embeds: [deniedResponseMessage],
							ephemeral: true,
						});
						return;
					}
					i.reply({
						embeds: [responseMessage],
						ephemeral: true,
					});
					pollResponses3++;
					responders.push(i.user.id);
					if (visibleResults && !pollOver) updateMessage(true);
				} else if (i.customId === uuid + "::pollButton4") {
					if (responders.includes(i.user.id)) {
						i.reply({
							embeds: [deniedResponseMessage],
							ephemeral: true,
						});
						return;
					}
					i.reply({
						embeds: [responseMessage],
						ephemeral: true,
					});
					pollResponses4++;
					responders.push(i.user.id);
					if (visibleResults && !pollOver) updateMessage(true);
				}
			})

			collector2.on("end", async i => {
				try {
					pollOver = true;
					updateMessage(false);
					await pollMessage.edit({
						embeds: [
							new MessageEmbed()
								.setColor("#2f3136")
								.setTitle(question)
								.setDescription(results + "\n" + "🕑  Closed on <t:" + + Math.round(new Date().getTime() / 1000) + ">")
								.setFooter({ text: "Poll made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
						],
						components: [],
					});
				} catch { }

			})
		}

		async function updateMessage(updateActualMessage: boolean) {
			if (!updateActualMessage) updateActualMessage = true;

			results = "```" + pollButton1 + ": \t" + pollResponses1 + " Votes" + "\n\n" + pollButton2 + ": \t" + pollResponses2 + " Votes"
			if (button3exists) results += "\n\n" + pollButton3 + ": \t" + pollResponses3 + " Votes"
			if (button4exists) results += "\n\n" + pollButton4 + ": \t" + pollResponses4 + " Votes"
			results += "```";

			try {
				if (updateActualMessage) {
					if (ping == "") {
						await pollMessage.edit({
							embeds: [poll(results)],
							components: pollButtons
						})
					} else {
						await pollMessage.edit({
							content: ping,
							embeds: [poll(results)],
							components: pollButtons
						})
					}
				}
			} catch { }
		}
	} catch (error) {
		logMessage(error, "/send poll command", interaction);
	}
}