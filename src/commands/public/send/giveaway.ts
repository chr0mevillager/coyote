import {
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
import * as data from "../../../exports/data";

let giveawayData = {};

const responseMessage = new MessageEmbed()
	.setColor("#3aef3a")
	.setTitle("Entered Giveaway")
	.setDescription("Your entry has been saved.\n\nRemember, you can enter once.")
	.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/giveaway.png?raw=true")

const deniedResponseMessage = new MessageEmbed()
	.setColor("#ff6c08")
	.setTitle("You can Only Enter a Giveaway Once")
	.setDescription("Your entry has already been saved.")
	.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/giveaway.png?raw=true")

export async function giveawayInteraction(interaction) {
	try {
		data.commandUsed("giveaway");

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
				.setColor("#2f3136")
				.setTitle(item + " Giveaway")
				.setDescription("```" + winnerNumber + " winners```\n" + results + "🕑  Closes <t:" + timeToClose + ":R>")
		} else {
			giveaway = (results: string) => new MessageEmbed()
				.setColor("#2f3136")
				.setTitle(item + " Giveaway")
				.setDescription("```" + winnerNumber + " winners```\n" + results + "🕑  Closes <t:" + timeToClose + ":R>")
				.setFooter({ text: "Giveaway made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
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
					.setLabel("If you win, this will be sent to the author.")
					.setStyle("PARAGRAPH")
					.setPlaceholder("Please provide:\n\n" + input)
					.setRequired(true)
			);
		const modal = (uuid) => new Modal()
			.setTitle("Giveaway Details")
			.setCustomId("send::" + uuid + "::giveawayEnter")
			.setComponents(inputModal)

		//Send Preview ---
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
		let collector1 = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000 });
		collector1.on("collect", async (i) => {
			//Send
			if (i.customId === uuid + "::send") {
				data.buttonUsed("giveaway", "send");
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
				data.buttonUsed("giveaway", "cancel");
				sendUpdate(i);
				if (ping == "") {
					await interaction.editReply({
						embeds: [
							questionEmbeds.cancel,
							new MessageEmbed()
								.setColor("#2f3136")
								.setTitle(item + " Giveaway")
								.setDescription("```" + winnerNumber + " winners```\n" + results + "🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>")
								.setFooter({ text: "Giveaway made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
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
								.setTitle(item + " Giveaway")
								.setDescription("```" + winnerNumber + " winners```\n" + results + "🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>")
								.setFooter({ text: "Giveaway made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
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
							.setTitle(item + " Giveaway")
							.setDescription("```" + winnerNumber + " winners```\n" + results + "🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>")
							.setFooter({ text: "Giveaway made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
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
							.setTitle(item + " Giveaway")
							.setDescription("```" + winnerNumber + " winners```\n" + results + "🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>")
							.setFooter({ text: "Giveaway made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
					],
					components: [
						buttons.buttonRowDisabled(uuid),
					],
				});
			}
		})
		async function startGiveaway() {

			//Collector 2 ---
			let collector2 = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::enter`, time: 8640 /*0000*/ });
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
					data.buttonUsed("giveaway", "entry");
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
								.setColor("#2f3136")
								.setTitle(item + " Giveaway")
								.setDescription("```" + winnerNumber + " winners```\n" + results + "🕑  Closed on <t:" + Math.round(new Date().getTime() / 1000) + ":D>")
								.setFooter({ text: "Giveaway made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })

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
							.setColor("#2f3136")
							.setTitle("Congratulations on winning the " + item + " giveaway!")
							.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/giveaway.png?raw=true")
					],
				});

				if (input != "") {
					let dm = new MessageEmbed()
						.setColor("#2f3136")
						.setTitle("Your " + item + " Giveaway Has Ended!")
						.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/icon/giveaway.png?raw=true")
						.setFooter({
							text: "Note:\nOn non-mobile devices, the winners above may not be properly displayed.",
						})

					for (let i = 0; i < formattedWinners.length; i++) {
						dm.addField(
							"<@" + winners[i] + ">",
							(giveawayData[uuid].data[winners[i]] + "\u200b"),
							true)
					}
					try {
						await interaction.user.send({
							embeds: [dm],
						});
					} catch { }

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

		giveawayData[id].data[interaction.user.id] = interaction.fields.getTextInputValue("text");

		(giveawayData[id].entries).push(interaction.user.id);

		interaction.reply({
			embeds: [responseMessage],
			ephemeral: true,
		});
	} catch (error) {
		logMessage(error, "/send giveaway command (modal received)", interaction);
	}

}