import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	MessageSelectMenu,
	Role,
} from "discord.js";
import { client } from "../../../exports/client";
import generateTimeStamp from "../../../exports/timestamp";
import * as buttons from "../../../exports/send_buttons";
import sendUpdate from "../../../exports/send_update";
import * as questionEmbeds from "../../../exports/question_embeds";
import logMessage from "../../../exports/error";
import * as mode from "../../../exports/mode";
import * as data from "../../../exports/data";
import { commandHelp } from "src/exports/types";

export const help: commandHelp = {
	name: "poll",
	fullName: "/send poll",
	module: "embeds",
	keywords: [
		"poll",
		"ballot",
		"vote",
		"embed",
		"survey",
		"question",
		"ask",
		"sample",
		"send",
		"message",
	],
	helpMessage: new MessageEmbed()
		.setColor("#2f3136")
		.setTitle("Poll")
		.setDescription("Send a simple poll! Polls are open for 1 day.\n\n```/send poll < Question > < Option 1 > < Option 2 > [ Option 3 ] [ Option 4 ] [ Ping Group ] [ Live Results ]```")
		.addFields(
			{
				name: "Question",
				value: "```Type in the poll question in less than 256 characters. Use \\n\ to create an enter, \\u200B to create an empty feild, and to create a link, type ( Your Text )[ URL ]```",
				inline: false,
			},
			{
				name: "Question 1",
				value: "```Type in a response to your question that is less than 100 characters.```",
				inline: true,
			},
			{
				name: "Question 2",
				value: "```Type in a response to your question that is less than 100 characters.```",
				inline: true,
			},
			{
				name: "Question 3",
				value: "```Type in a response to your question that is less than 100 characters.```",
				inline: true,
			},
			{
				name: "Question 4",
				value: "```Type in a response to your question that is less than 100 characters.\n\n\n\u200b```",
				inline: true,
			},
			{
				name: "Ping Group",
				value: "```Select who you want to ping with the message.\n\n\n\n\u200b```",
				inline: true,
			},
			{
				name: "Live Results",
				value: "```Decide if poll should show results as users vote. Results will always be shown after the poll is over.```",
				inline: true,
			},
		),
}

export async function interaction(interaction) {
	try {
		data.commandUsed("poll");

		//Inputs ---
		let question: string = interaction.options.getString("question");
		let results: string = "";
		let visibleResults = true;
		let ping: string = "";

		if (question.length > 256) question = question.slice(0, 256);
		try {
			question = JSON.parse('"' + question.replace(/"/g, '\\"') + '"');
		} catch { }
		if (interaction.options.getBoolean("live-results") == false) {
			visibleResults = false;
		}

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
			.setDescription("```Your input has been saved.``````Remember, you can only vote once.```")
			.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/poll.png?raw=true")

		const deniedResponseMessage = new MessageEmbed()
			.setColor("#ff6c08")
			.setTitle("You can Only Enter a Poll Once")
			.setDescription("```Your input has already been saved.```")
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

		try {
			pollButton1 = JSON.parse('"' + pollButton1.replace(/"/g, '\\"') + '"');
			pollButton2 = JSON.parse('"' + pollButton2.replace(/"/g, '\\"') + '"');
		} catch { }

		if (pollButton1.length > 100) pollButton1 = pollButton1.slice(0, 100);
		if (pollButton2.length > 100) pollButton2 = pollButton2.slice(0, 100);

		let button3exists = false;
		let button4exists = false;

		let dropdown = new MessageSelectMenu()
			.setCustomId(uuid + "::vote")
			.setPlaceholder("Select Your Vote")
			.addOptions(
				{
					label: pollButton1,
					description: "",
					value: "option-1",
				},
				{
					label: pollButton2,
					description: "",
					value: "option-2",
				},
			)

		if ((interaction.options.getString("option-3")) != null && (interaction.options.getString("option-3")) != undefined) {
			button3exists = true;
			pollButton3 = interaction.options.getString("option-3");
			if (pollButton3.length > 100) pollButton3 = pollButton3.slice(0, 100);
			try {
				pollButton3 = JSON.parse('"' + pollButton3.replace(/"/g, '\\"') + '"');
			} catch { }
			dropdown.addOptions(
				{
					label: pollButton3,
					description: "",
					value: "option-3",
				},
			);
		}
		if ((interaction.options.getString("option-4")) != null && (interaction.options.getString("option-4")) != undefined) {
			button4exists = true;
			pollButton4 = interaction.options.getString("option-4");
			if (pollButton4.length > 100) pollButton4 = pollButton4.slice(0, 100);
			try {
				pollButton4 = JSON.parse('"' + pollButton4.replace(/"/g, '\\"') + '"');
			} catch { }
			dropdown.addOptions(
				{
					label: pollButton4,
					description: "",
					value: "option-4",
				},
			);
		}

		let dropdownRow = (uuid: string) => new MessageActionRow()
			.addComponents(dropdown);

		const pollButtons = [dropdownRow(uuid)];

		//Embed
		let poll;
		if (interaction.user.id == process.env.OWNER_ID) {
			poll = (votingStatus: string) => new MessageEmbed()
				.setColor("#2f3136")
				.setTitle(question)
				.setDescription("🕑  Closes <t:" + timeToClose + ":R>" + votingStatus)
		} else {
			poll = (votingStatus: string) => new MessageEmbed()
				.setColor("#2f3136")
				.setTitle(question)
				.setDescription("🕑  Closes <t:" + timeToClose + ":R>" + votingStatus)
				.setFooter({ text: "Poll made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
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
		let collector1 = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000, max: 1 });
		collector1.on("collect", async (i) => {

			//Send
			if (i.customId === uuid + "::send") {
				updateSent = true;
				data.buttonUsed("poll", "send");
				sendUpdate(i);
				//Change Message for Result Visibility
				if (visibleResults) {
					results = "```No votes yet.```";
				} else {
					results = "";
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
				} catch (error) {
					await interaction.editReply({
						embeds: [questionEmbeds.invalidPerms, poll(previewResults)],
						components: [
							buttons.buttonRowDisabled(uuid),
						],
					});
					console.error(error);
				}

				//Cancel
			} else if (i.customId === uuid + "::cancel") {
				updateSent = true;
				data.buttonUsed("poll", "cancel");
				sendUpdate(i);
				if (ping == "") {
					await interaction.editReply({
						embeds: [
							questionEmbeds.cancel,
							new MessageEmbed()
								.setColor("#2f3136")
								.setTitle(question)
								.setDescription("🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>" + results)
								.setFooter({ text: "Poll made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
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
								.setDescription("🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>" + results)
								.setFooter({ text: "Poll made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
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
							.setDescription("🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>" + previewResults)
							.setFooter({ text: "Poll made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
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
							.setDescription("🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>" + previewResults)
							.setFooter({ text: "Poll made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
					],
					components: [
						buttons.buttonRowDisabled(uuid),
					],
				});
			}
		})

		async function startPoll() {
			//Collector 2 --
			let collector2 = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::vote` || i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 86400000 /* 0000 */ });

			collector2.on("collect", async (i) => {
				if (pollOver) return;
				if (i.customId === uuid + "::vote") {
					if (responders.includes(i.user.id)) {
						i.reply({
							embeds: [deniedResponseMessage],
							ephemeral: true,
						});
						return;
					}
					data.buttonUsed("poll", "response");
					await i.reply({
						embeds: [responseMessage],
						ephemeral: true,
					});
					if (i.values == "option-1") {
						pollResponses1++;
					} else if (i.values == "option-2") {
						pollResponses2++;
					} else if (i.values == "option-3") {
						pollResponses3++;
					} else if (i.values == "option-4") {
						pollResponses4++;
					}
					responders.push(i.user.id);
					if (visibleResults && !pollOver) updateMessage();
				}
			})

			collector2.on("end", async i => {
				try {
					pollOver = true;
					await updateMessage();
				} catch { }

			})
		}

		async function updateMessage() {
			let votes1 = " Votes", votes2 = " Votes", votes3 = " Votes", votes4 = " Votes";

			if (pollResponses1 == 1) votes1 = " Vote";
			if (pollResponses2 == 1) votes2 = " Vote";
			if (pollResponses3 == 1) votes3 = " Vote";
			if (pollResponses4 == 1) votes4 = " Vote";

			let updatedPoll = poll("");;
			let dropdownComponents = pollButtons;
			if (pollOver) {
				dropdownComponents = [];
				updatedPoll = new MessageEmbed()
					.setColor("#2f3136")
					.setTitle(question)
					.setDescription("🕑  Closed on <t:" + + Math.round(new Date().getTime() / 1000) + ":D>")
					.setFooter({ text: "Poll made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
			}

			updatedPoll.addField(
				pollButton1,
				"```" + pollResponses1 + votes1 + "```",
				true,
			);
			updatedPoll.addField(
				pollButton2,
				"```" + pollResponses2 + votes2 + "```",
				true,
			);

			if (button3exists) updatedPoll.addField(
				pollButton3,
				"```" + pollResponses3 + votes3 + "```",
				true,
			);
			if (button4exists) updatedPoll.addField(
				pollButton4,
				"```" + pollResponses4 + votes4 + "```",
				true,
			);

			try {
				if (ping == "") {
					await pollMessage.edit({
						embeds: [updatedPoll],
						components: dropdownComponents,
					})
				} else {
					await pollMessage.edit({
						content: ping,
						embeds: [updatedPoll],
						components: dropdownComponents,
					})
				}
			} catch { }
		}
	} catch (error) {
		logMessage(error, "/send poll command", interaction);
	}
}