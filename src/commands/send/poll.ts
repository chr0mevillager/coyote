import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
} from "discord.js";
import { client } from "../../exports/client";
import { v4 as uuidv4 } from "uuid";

export default async function pollInteraction(interaction) {
	//Blank Vars
	let question: string = "\u200B";
	let results: string = "\u200B";
	let visibleResults = true;

	let pollResponses1 = [];
	let pollResponses2 = [];
	let pollResponses3 = [];
	let pollResponses4 = [];
	let responders = [];

	let update_sent = false;

	let pollMessage;

	//Get selected variables
	question = interaction.options.getString("question");
	if (interaction.options.get("visible-results")) {
		visibleResults = interaction.options.get("visible-results")
		if (visibleResults) results = "```Poll results will appear here.```";
	}


	if (question.length > 256) question = question.slice(0, 256);
	question = JSON.parse('"' + question.replace(/"/g, '\\"') + '"');

	//Buttons
	const buttonRow = (uuid: string) => new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId(uuid + "::send")
				.setLabel("Send")
				.setStyle("SUCCESS"),
			new MessageButton()
				.setCustomId(uuid + "::cancel")
				.setLabel("Cancel")
				.setStyle("DANGER"),
		);
	const buttonRowDisabled = (uuid: string) => new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId(uuid + "::send")
				.setLabel("Send")
				.setStyle("SUCCESS")
				.setDisabled(true),
			new MessageButton()
				.setCustomId(uuid + "::cancel")
				.setLabel("Cancel")
				.setStyle("DANGER")
				.setDisabled(true),
		);

	//Poll Buttons
	const pollButtonRow1 = (uuid: string) => new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId(uuid + "::pollButton1")
				.setLabel(interaction.options.getString("option-1"))
				.setStyle("PRIMARY")
		);
	const pollButtonRow2 = (uuid: string) => new MessageActionRow()
		.addComponents(
			new MessageButton()
				.setCustomId(uuid + "::pollButton2")
				.setLabel(interaction.options.getString("option-2"))
				.setStyle("PRIMARY")
		);
	if ((interaction.options.getString("option-3")) != null && (interaction.options.getString("option-3")) != undefined) {
		const pollButtonRow3 = (uuid: string) => new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId(uuid + "::pollButton3")
					.setLabel(interaction.options.getString("option-3"))
					.setStyle("PRIMARY")
			);
		if ((interaction.options.getString("option-3")) != null && (interaction.options.getString("option-3")) != undefined) {
			const pollButtonRow4 = (uuid: string) => new MessageActionRow()
				.addComponents(
					new MessageButton()
						.setCustomId(uuid + "::pollButton4")
						.setLabel(interaction.options.getString("option-4"))
						.setStyle("PRIMARY")
				);
		}
	}

	let uuid = uuidv4();

	//Send preview
	await interaction.reply({
		content: "**Here is your message:**",
		embeds: [
			new MessageEmbed()
				.setColor("#2f3136")
				.setTitle(question)
				.setDescription(results)
				.setFooter({ text: "Poll Made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
		],
		components: [
			buttonRow(uuid),
			pollButtonRow1(uuid),
			pollButtonRow2(uuid),
		],
		ephemeral: true,
	});

	//Button Responses
	let collector = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::pollButton1` || i.customId === `${uuid}::pollButton2` || i.customId === `${uuid}::pollButton3` || i.customId === `${uuid}::pollButton4` || i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000 });
	collector.on("collect", async (i) => {
		//Send final

		//Send
		if (i.customId === uuid + "::send") {
			try {
				await (client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
					embeds: [
						new MessageEmbed()
							.setColor("#2f3136")
							.setTitle(question)
							.setDescription(results + "\n" + "\u200B")
							.setFooter({ text: "Sent by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
					],
					components: [
						pollButtonRow1(uuid),
						pollButtonRow2(uuid),
					],
				}).then(sentMessage => {
					pollMessage = sentMessage;
				});

				await interaction.editReply({
					content: "\u200B",
					embeds: [
						new MessageEmbed()
							.setColor("#3ba55d")
							.setTitle("Sent!")
					],
					components: [
						buttonRowDisabled(uuid),
						pollButtonRow1(uuid),
						pollButtonRow2(uuid),
					],
				});

				await i.deferUpdate();
			} catch {
				//Invalid Perms
				await interaction.editReply({
					content: "\u200B",
					embeds: [
						new MessageEmbed()
							.setColor("#ed4245")
							.setTitle("Invalid permissions")
							.setDescription("Please make sure I have the correct permissions to:")
							.addFields(
								{
									name: "See this channel properly",
									value: "`View Channels` Permission"
								},
								{
									name: "Send messages",
									value: "`Send Messages` Permission"
								},
								{
									name: "Send embeded messages",
									value: "`Embed Links` Permission"
								},
							)
					],
					components: [
						buttonRowDisabled(uuid),
						pollButtonRow1(uuid),
						pollButtonRow2(uuid),
					],
				});
				await i.deferUpdate();
				update_sent = true;
			}
			//Cancel
		} else if (i.customId === uuid + "::cancel") {
			await interaction.editReply({
				content: "**Canceled!**",
				embeds: [
					new MessageEmbed()
						.setColor("#2f3136")
						.setTitle(question)
						.setDescription(results + "\n" + "\u200B")
						.setFooter({ text: "Poll Made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
				],
				components: [
					buttonRowDisabled(uuid),
					pollButtonRow1(uuid),
					pollButtonRow2(uuid),
				],
			});
			await i.deferUpdate();
			update_sent = true;
			//Buttons
		} else if (i.customId === uuid + "::pollButton1") {
			if (!responders.includes(i.user.id)) pollResponses1.push(i.user.id);
			responders.push(i.user.id);
			console.log(responders);
			await i.deferUpdate();
			if (visibleResults) updateMessage();
		} else if (i.customId === uuid + "::pollButton2") {
			if (!responders.includes(i.user.id)) pollResponses2.push(i.user.id);
			responders.push(i.user.id);
			await i.deferUpdate();
			if (visibleResults) updateMessage();
		} else if (i.customId === uuid + "::pollButton3") {
			if (!responders.includes(i.user.id)) pollResponses3.push(i.user.id);
			responders.push(i.user.id);
			await i.deferUpdate();
			if (visibleResults) updateMessage();
		} else if (i.customId === uuid + "::pollButton4") {
			if (!responders.includes(i.user.id)) pollResponses4.push(i.user.id);
			responders.push(i.user.id);
			await i.deferUpdate();
			if (visibleResults) updateMessage();
		}
	});

	collector.on("end", async i => {
		if (!update_sent) await interaction.editReply({
			content: "**Poll Ended!**",
			embeds: [
				new MessageEmbed()
					.setColor("#2f3136")
					.setTitle(question)
					.setDescription(results + "\n" + "\u200B")
					.setFooter({ text: "Poll Made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
			],
			components: [
				buttonRowDisabled(uuid),
				pollButtonRow1(uuid),
				pollButtonRow2(uuid),
			],
		});
		if (!visibleResults) updateMessage();
		await pollMessage.edit({
			embeds: [
				new MessageEmbed()
					.setColor("#2f3136")
					.setTitle(question)
					.setDescription(results)
					.setFooter({ text: "Poll Made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
			]
		});
	})

	async function updateMessage() {
		results = "```Option 1: " + pollResponses1.length +
			"\n\nOption 2: " + pollResponses2.length +
			"```";

		await pollMessage.edit({
			embeds: [
				new MessageEmbed()
					.setColor("#2f3136")
					.setTitle(question)
					.setDescription(results)
					.setFooter({ text: "Poll Made by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
			],
			components: [
				buttonRowDisabled(uuid),
				pollButtonRow1(uuid),
				pollButtonRow2(uuid),
			],
		});
	}
}

