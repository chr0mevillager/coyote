import {
	Message,
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	Modal,
	ModalActionRowComponent,
	Role,
	TextInputComponent,
} from "discord.js";
import { client } from "../../../exports/client";
import generateTimeStamp from "../../../exports/timestamp";
import * as buttons from "../../../exports/send_buttons";
import sendUpdate from "../../../exports/send_update";
import * as questionEmbeds from "../../../exports/question_embeds";
import logMessage from "../../../exports/error";
import * as mode from "../../../exports/mode";
import { commandData, commandHelp } from "src/exports/types";
import * as colors from "../../../exports/colors";

export const help: commandHelp = {
	name: "giveaway",
	fullName: "/send giveaway",
	module: "embeds",
	keywords: [
		"giveaway",
		"give",
		"away",
		"embed",
		"gift",
		"send",
		"message",
		"enter",
		"sweep",
	],
	helpMessage: new MessageEmbed()
		.setColor(colors.clearColor)
		.setTitle("Giveaway")
		.setDescription("Send a robust giveaway! Giveaways are open for 1 day.\n\n```/send giveaway < Item > < # of Winners > [ Ping Group ] [ Required Input ]```")
		.addFields(
			{
				name: "Item",
				value: "```Type in the item you would like to give away in less than 200 charicters.```",
				inline: true,
			},
			{
				name: "# of Winners",
				value: "```Type in how many people you would like to win the giveaway (1-100).\n\u200b```",
				inline: true,
			},
			{
				name: "Ping Group",
				value: "```Select who you want to ping with the message.\n\n\u200b```",
				inline: true,
			},
			{
				name: "Required Input",
				value: "```Type in what information users must provide in less than 80 characters.```",
				inline: true,
			},
		),
}

export const info: commandData = {
	uses: 0,
	buttons: {
		send: 0,
		cancel: 0,
		entry: 0,
	},
}

let giveawayData = {};

const responseMessage = new MessageEmbed()
	.setColor(colors.successColor)
	.setTitle("Entered Giveaway")
	.setDescription("```Your entry has been saved.``````Remember, you can enter once.```")

const deniedResponseMessage = new MessageEmbed()
	.setColor(colors.cancelColor)
	.setTitle("You can Only Enter a Giveaway Once")
	.setDescription("```Your entry has already been saved.```")

const deleteButtonRowDisabled = new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId("send::giveawayDelete")
			.setLabel("Delete Message 🗑")
			.setStyle("DANGER")
			.setDisabled(true)
	)

const deleteButtonRow = (messageID: string) => new MessageActionRow()
	.addComponents(
		new MessageButton()
			.setCustomId("send::" + messageID + "::giveawayDelete")
			.setLabel("Delete Message 🗑")
			.setStyle("DANGER")
	)

export async function deletion(interaction) {
	const [command, messageId, data] = (interaction.customId).split("::");
	const user = client.users.fetch(interaction.user);
	try {
		await interaction.deferUpdate();
		(await user).dmChannel.messages.fetch(messageId).then(message => message.delete());
	} catch {
		try {
			const channel = (await user).createDM();
			(await channel).messages.fetch(messageId).then(message => message.delete());
		} catch {

		}
	}
}

export async function interaction(interaction) {
	try {
		info.uses++;

		//Inputs ---
		let item: string = interaction.options.getString("item");
		let winnerNumber = interaction.options.getInteger("number-of-winners");
		let input: string = "";
		let inputWarning = "";
		let ping: string = "";

		if (item.length > 200) item = item.slice(0, 200);
		try {
			item = JSON.parse('"' + item.replace(/"/g, '\\"') + '"');
		} catch { }

		if (interaction.options.getString("required-input")) {
			inputWarning = "Users will have to enter their information in before entering the giveaway. Please make sure your DM's are open with this bot to ensure you receive the information they provide.\n\n"
			input = interaction.options.getString("required-input");
			if (input.length > 80) input = input.slice(0, 80);
			try {
				input = JSON.parse('"' + input.replace(/"/g, '\\"') + '"');
			} catch { }
		}

		//Other Variables
		let winners = [];
		let updateSent = false;
		let timeToClose = generateTimeStamp(1, 0, 0);
		let uuid = interaction.id;
		let giveawayMessage;
		let giveawayOver;
		let results = "";

		const giveawayButtonRow = (uuid: string) => new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(uuid + "::enter")
					.setLabel("Enter Giveaway")
					.setStyle("PRIMARY")
			);
		const giveawayButtons = [giveawayButtonRow(uuid)]

		//Embed
		let giveaway;
		if (interaction.user.id == process.env.OWNER_ID) {
			giveaway = (results: string) => new MessageEmbed()
				.setColor(colors.clearColor)
				.setTitle(item + " Giveaway")
				.setDescription("🕑  Closes <t:" + timeToClose + ":R>" + "```" + winnerNumber + " winners```\n" + results)
		} else {
			giveaway = (results: string) => new MessageEmbed()
				.setColor(colors.clearColor)
				.setTitle(item + " Giveaway")
				.setDescription("🕑  Closes <t:" + timeToClose + ":R>" + "```" + winnerNumber + " winners```\n" + results)
				.setFooter({ text: "Giveaway made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
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

		//Modal
		const inputModal = new MessageActionRow<ModalActionRowComponent>()
			.addComponents(
				new TextInputComponent()
					.setCustomId("text")
					.setLabel("If you win, this will be sent to the author")
					.setStyle("PARAGRAPH")
					.setPlaceholder("Please provide:\n\n" + input)
					.setRequired(true)
					.setMinLength(1)
					.setMaxLength(300)
			);
		const modal = (uuid) => new Modal()
			.setTitle("Giveaway Details")
			.setCustomId("send::" + uuid + "::giveawayEnter")
			.setComponents(inputModal)

		//Send Preview ---

		//Check for winner number
		if (winnerNumber > 20 && results != "") {

		}

		if (ping == "") {
			await interaction.reply({
				embeds: [questionEmbeds.question(mode.image, inputWarning + mode.description), giveaway(results)],
				components: [buttons.buttonRow(uuid)],
				ephemeral: true,
			});
		} else {
			await interaction.reply({
				content: ping,
				embeds: [questionEmbeds.question(mode.image, mode.description), giveaway(results)],
				components: [buttons.buttonRow(uuid)],
				ephemeral: true,
			});
		}

		//Start Collector 1 ---
		let collector1 = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000, max: 1 });
		collector1.on("collect", async (i) => {
			//Send
			if (i.customId === uuid + "::send") {
				info.buttons["send"]++;
				sendUpdate(i);

				giveawayData[uuid] = {
					data: {

					},
					entries: [

					],
				}

				//Change Message for Pinging
				try {
					if (ping == "") {
						await (client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
							embeds: [giveaway(results)],
							components: giveawayButtons,
						}).then(sentMessage => {
							giveawayMessage = sentMessage;
						});
					} else {
						await (client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
							content: ping,
							embeds: [giveaway(results)],
							components: giveawayButtons,
						}).then(sentMessage => {
							giveawayMessage = sentMessage;
						});
					}

					if (ping == "") {
						await interaction.editReply({
							embeds: [questionEmbeds.send, giveaway(results)],
							components: [
								buttons.buttonRowDisabled(uuid),
							],
						});
					} else {
						await interaction.editReply({
							content: ping,
							embeds: [questionEmbeds.send, giveaway(results)],
							components: [
								buttons.buttonRowDisabled(uuid),
							],
						});
					}
					startGiveaway();

				} catch (error) {
					await interaction.editReply({
						embeds: [questionEmbeds.invalidPerms, giveaway(results)],
						components: [
							buttons.buttonRowDisabled(uuid),
						],
					});
				}
				updateSent = true;

				//Cancel
			} else if (i.customId === uuid + "::cancel") {
				updateSent = true;
				info.buttons["cancel"]++;
				sendUpdate(i);
				if (ping == "") {
					await interaction.editReply({
						embeds: [
							questionEmbeds.cancel,
							new MessageEmbed()
								.setColor(colors.clearColor)
								.setTitle(item + " Giveaway")
								.setDescription("🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>" + "```" + winnerNumber + " winners```\n" + results)
								.setFooter({ text: "Giveaway made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
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
								.setColor(colors.clearColor)
								.setTitle(item + " Giveaway")
								.setDescription("🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>" + "```" + winnerNumber + " winners```\n" + results)
								.setFooter({ text: "Giveaway made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
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
							.setColor(colors.clearColor)
							.setTitle(item + " Giveaway")
							.setDescription("🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>" + "```" + winnerNumber + " winners```\n" + results)
							.setFooter({ text: "Giveaway made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
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
							.setColor(colors.clearColor)
							.setTitle(item + " Giveaway")
							.setDescription("🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>" + "```" + winnerNumber + " winners```\n" + results)
							.setFooter({ text: "Giveaway made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })
					],
					components: [
						buttons.buttonRowDisabled(uuid),
					],
				});
			}
		})
		async function startGiveaway() {

			//Collector 2 ---
			let collector2 = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::enter`, time: 86400000 /*0000*/ });
			collector2.on("collect", async (i) => {

				if (giveawayOver) return;
				if (i.customId === uuid + "::enter") {
					if ((giveawayData[uuid].entries).includes(i.user.id)) {
						i.reply({
							embeds: [deniedResponseMessage],
							ephemeral: true,
						});
						return;
					}
					info.buttons["entry"]++;
					if (input == "") {
						i.reply({
							embeds: [responseMessage],
							ephemeral: true,
						});
						(giveawayData[uuid].entries).push(i.user.id);
					} else {
						await i.showModal(modal(uuid));
					}
				}
			})

			collector2.on("end", async i => {
				giveawayOver = true;
				if (winnerNumber >= (giveawayData[uuid].entries).length) {
					winners = (giveawayData[uuid].entries);
				} else {
					const winnerNumberConst = winnerNumber;
					for (let i = 0; i < winnerNumber; i++) {
						let winner = (giveawayData[uuid].entries)[Math.floor(Math.random() * (winnerNumberConst))];
						if (!winners.includes(winner)) {
							winners.push(winner);
						} else {
							winnerNumber++;
						}

					}
				}
				let messageAlive = true;
				try {
					await giveawayMessage.edit({
						embeds: [
							new MessageEmbed()
								.setColor(colors.clearColor)
								.setTitle(item + " Giveaway")
								.setDescription("🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>" + "```" + winnerNumber + " winners```\n" + results)
								.setFooter({ text: "Giveaway made by: " + (interaction.user.username).slice(0, 250), iconURL: interaction.user.avatarURL() })

						],
						components: [],
					});
				} catch {
					messageAlive = false;
				}

				let formattedWinners = [];
				winners.forEach(winner => {
					formattedWinners.push(" <@" + winner + ">");
				});

				if ((giveawayData[uuid].entries).length == 0) return;
				if (messageAlive) await (client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
					content: formattedWinners + "",
					embeds: [
						new MessageEmbed()
							.setColor(colors.clearColor)
							.setTitle("Congratulations on winning the " + item + " giveaway!")
							.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/giveaway.png?raw=true")
					],
				});

				if (input != "") {
					let dm = new MessageEmbed()
						.setColor(colors.clearColor)
						.setTitle("Your " + item + " Giveaway Has Ended!")
						.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/giveaway.png?raw=true")
						.setFooter({
							text: "Tip:\nIf users provided sensitive information, please delete this information after you are done with it.",
						})

					for (let i = 0; i < formattedWinners.length; i++) {
						dm.addField(
							"Winner #" + (i + 1),
							"<@" + winners[i] + ">" + (giveawayData[uuid].data[winners[i]] + "\u200b"),
							true,
						)
					}
					try {
						await interaction.user.send({
							embeds: [dm],
							components: [deleteButtonRowDisabled],
						}).then(message =>
							message.edit({
								embeds: [dm],
								components: [deleteButtonRow(message.id)]
							}))

					} catch {

					}

				}

				delete giveawayData[uuid];
			})
		}
	} catch (error) {
		logMessage(error, "/send giveaway command", interaction);
	}
}

export async function modalInteraction(interaction) {
	try {
		const [command, id, data] = (interaction.customId).split("::");

		giveawayData[id].data[interaction.user.id] = "```" + interaction.fields.getTextInputValue("text") + "```";

		(giveawayData[id].entries).push(interaction.user.id);

		interaction.reply({
			embeds: [responseMessage],
			ephemeral: true,
		});
	} catch (error) {
		logMessage(error, "/send giveaway command (modal received)", interaction);
	}

}