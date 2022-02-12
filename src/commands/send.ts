import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	CommandInteraction,
	CacheType,
	InteractionCollector,
	MessageComponentInteraction,
} from "discord.js";
import { CustomCommand } from "../exports/types";
import { client } from "../exports/client";
import { v4 as uuidv4 } from "uuid";

let send: CustomCommand = {
	data: {
		name: "send",
		description: "Send an embeded message!",
		options: [
			{
				name: "announcement",
				description: "What do you want to send feedback about?",
				type: 1,
				options: [
					{
						name: "title",
						description: "What do you want the message to be titled?",
						type: "STRING",
						required: true,
					},
					{
						name: "description",
						description: "What do you want the description to be?",
						type: "STRING",
						required: true,
					},
					{
						name: "link",
						description: "What do you want to link?",
						type: "STRING",
						required: false,
					},
				]
			},
			// {
			// 	name: "warning",
			// 	description: "What do you want to warn?",
			// 	type: 1,
			// 	options: [
			// 		{
			// 			name: "title",
			// 			description: "What do you want the message to be titled?",
			// 			type: "STRING",
			// 			required: true,
			// 		},
			// 		{
			// 			name: "description",
			// 			description: "What do you want the description to be?",
			// 			type: "STRING",
			// 			required: true,
			// 		},
			// 	]
			// },
			{
				name: "poll",
				description: "What do you want to make a poll about?",
				type: 1,
				options: [
					{
						name: "title",
						description: "What do you want the message to be titled?",
						type: "STRING",
						required: true,
					},
					{
						name: "description",
						description: "What do you want the description to be?",
						type: "STRING",
						required: true,
					},
					{
						name: "option_1",
						description: "What will the first option be?",
						type: "STRING",
						required: true,
					},
					{
						name: "option_2",
						description: "What will the second option be?",
						type: "STRING",
						required: true,
					},
					{
						name: "option_3",
						description: "What will the third option be?",
						type: "STRING",
						required: false,
					},
					{
						name: "option_4",
						description: "What will the fourth option be?",
						type: "STRING",
						required: false,
					},
					{
						name: "option_5",
						description: "What will the fifth option be?",
						type: "STRING",
						required: false,
					},
					{
						name: "link",
						description: "What do you want to link?",
						type: "STRING",
						required: false,
					},
				]
			}
		],
	},

	async execute(interaction) {
		//Blank Vars
		let title: string = "\u200B";
		let description: string = "\u200B";
		let link: string = "";

		let option_1: string = "";
		let option_2: string = "";
		let option_3: string = "";
		let option_4: string = "";
		let option_5: string = "";

		//Get selected variables
		title = interaction.options.getString("title");
		description = interaction.options.getString("description");
		if (interaction.options.getString("link") && interaction.options.getString("link").match(/^((https:\/\/)|(http:\/\/))\w{2,100}(\.{1,10}\w{1,100}){1,100}(\/\w{0,100}){0,100}/gm)) link = interaction.options.getString("link");

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
		//Announcement
		if (interaction.options.getSubcommand() == "announcement") {
			let uuid = uuidv4();
			//Send preview
			await interaction.reply({
				content: "**Here is your message:**",
				embeds: [
					new MessageEmbed()
						.setColor("#2f3136")
						.setTitle(title)
						.setDescription(description + "\n" + "\u200B")
						.setURL(link)
						.setFooter({ text: "Sent by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })

				],
				components: [buttonRow(uuid)],
				ephemeral: true,
			});
			//Button Responses
			let collector = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000 });
			collector.on("collect", async (i) => {
				if (i.customId === uuid + "::send") {
					await interaction.editReply({
						content: "\u200B",
						embeds: [
							new MessageEmbed()
								.setColor("#3ba55d")
								.setTitle("Sent!")
						],
						components: [buttonRowDisabled(uuid)],
					});
					(client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
						embeds: [
							new MessageEmbed()
								.setColor("#2f3136")
								.setTitle(title)
								.setDescription(description + "\n" + "\u200B")
								.setURL(link)
								.setFooter({ text: "Sent by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })

						],
					});
					await i.deferUpdate();
				} else {
					await interaction.editReply({
						content: "\u200B",
						embeds: [
							new MessageEmbed()
								.setColor("#ed4245")
								.setTitle("Canceled!")
						],
						components: [buttonRowDisabled(uuid)],
					});
					await i.deferUpdate();
				}
			});
			collector.on("end", async i => {
				await interaction.editReply({
					content: "\u200B",
					embeds: [
						new MessageEmbed()
							.setColor("#ed4245")
							.setTitle("Timed out!")
					],
					components: [buttonRowDisabled(uuid)],
				});
			})
		}
		//Polls
		if (interaction.options.getSubcommand() == "poll") {
			let uuid = uuidv4();
			option_1 = interaction.options.getString("option_1");
			option_2 = interaction.options.getString("option_2");

			let options = [];
			let option;

			option = {
				name: ":one:",
				value: option_1,
			}
			options.push(option);
			option = {
				name: ":two:",
				value: option_2,
			}
			options.push(option);

			if (interaction.options.getString("option_3")) {
				option_3 = interaction.options.getString("option_3");
				option = {
					name: ":three:",
					value: option_3,
				}
				options.push(option);
			}
			if (interaction.options.getString("option_4")) {
				option_4 = interaction.options.getString("option_4");
				option = {
					name: ":four:",
					value: option_4,
				}
				options.push(option);
			}
			if (interaction.options.getString("option_5")) {
				option_5 = interaction.options.getString("option_5");
				option = {
					name: ":five:",
					value: option_5,
				}
				options.push(option);
			}

			//Send preview
			await interaction.reply({
				content: "**Here is your message:**",
				embeds: [
					new MessageEmbed()
						.setColor("#2f3136")
						.setTitle(title)
						.setDescription(description + "\n" + "\u200B")
						.setURL(link)
						.setFooter({ text: "Sent by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
						.setFields(options)

				],
				components: [buttonRow(uuid)],
				ephemeral: true,
			});

			//Button Responses
			let collector = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000 });
			collector.on("collect", async i => {
				if (i.customId === uuid + "::send") {
					await interaction.editReply({
						content: "\u200B",
						embeds: [
							new MessageEmbed()
								.setColor("#3ba55d")
								.setTitle("Sent!")
						],
						components: [buttonRowDisabled(uuid)],
					});
					(client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
						embeds: [
							new MessageEmbed()
								.setColor("#2f3136")
								.setTitle(title)
								.setDescription(description + "\n" + "\u200B")
								.setURL(link)
								.setFooter({ text: "Sent by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
								.setFields(options)

						],
					});
					await i.deferUpdate();
				} else {
					await interaction.editReply({
						content: "\u200B",
						embeds: [
							new MessageEmbed()
								.setColor("#ed4245")
								.setTitle("Canceled!")
						],
						components: [buttonRowDisabled(uuid)],
					});
					await i.deferUpdate();
				}
			});
			collector.on("end", async i => {
				await interaction.editReply({
					content: "\u200B",
					embeds: [
						new MessageEmbed()
							.setColor("#ed4245")
							.setTitle("Timed out!")
					],
					components: [buttonRowDisabled(uuid)],
				});
			})
		}
	},
};
export default send;

// const listeners: Record<string, InteractionCollector<MessageComponentInteraction<CacheType>>> = {};
// const buttonCallbacks = new Map<string, (interaction: MessageComponentInteraction<CacheType>) => void>();
// function createButtonListener(interaction: CommandInteraction<CacheType>) {
// 	const collector = interaction.channel.createMessageComponentCollector({});

// 	collector.on("collect", (interaction) => {
// 		if (buttonCallbacks.has(interaction.customId)) {
// 			buttonCallbacks.get(interaction.customId)(interaction);
// 		}
// 	});

// 	listeners[interaction.channel.id] = collector;
// }

// function createButtonListeners(interaction: CommandInteraction<CacheType>, buttonIds: string[], callback: (interaction: MessageComponentInteraction<CacheType>) => boolean) {
// 	if (!listeners[interaction.channel.id]) createButtonListener(interaction);

// 	function handler(interaction: MessageComponentInteraction<CacheType>) {
// 		const shouldRemove = callback(interaction);
// 		if (shouldRemove) {
// 			buttonIds.forEach((buttonId) => buttonCallbacks.delete(buttonId));
// 		}
// 	}

// 	buttonIds.forEach((buttonId) => {
// 		buttonCallbacks.set(buttonId, handler);
// 	});
// }
