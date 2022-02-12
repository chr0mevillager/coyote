import { MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { CustomCommand } from "../exports/types";
import { client } from "../exports/client";

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
		const buttonRow = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("send")
					.setLabel("Send")
					.setStyle("SUCCESS"),
				new MessageButton()
					.setCustomId("cancel")
					.setLabel("Cancel")
					.setStyle("DANGER"),
			);
		const buttonRowDisabled = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("send")
					.setLabel("Send")
					.setStyle("SUCCESS")
					.setDisabled(true),
				new MessageButton()
					.setCustomId("cancel")
					.setLabel("Cancel")
					.setStyle("DANGER")
					.setDisabled(true),
			);

		//Announcement
		if (interaction.options.getSubcommand() == "announcement") {
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
				components: [buttonRow],
				ephemeral: true,
			});
			//Button Responses
			let filter = i => i.customId === "send" || i.customId === "cancel";
			let collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
			collector.on("collect", async i => {
				if (i.customId === "send") {
					await i.deferUpdate();
					await interaction.editReply({
						content: "\u200B",
						embeds: [
							new MessageEmbed()
								.setColor("#3ba55d")
								.setTitle("Sent!")
						],
						components: [buttonRowDisabled],
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
				} else {
					await i.deferUpdate();
					await interaction.editReply({
						content: "\u200B",
						embeds: [
							new MessageEmbed()
								.setColor("#ed4245")
								.setTitle("Canceled!")
						],
						components: [buttonRowDisabled],
					});
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
					components: [buttonRowDisabled],
				});
			})
		}
		//Polls
		if (interaction.options.getSubcommand() == "poll") {
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
				components: [buttonRow],
				ephemeral: true,
			});

			//Button Responses
			let filter = i => i.customId === "send" || i.customId === "cancel";
			let collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });
			collector.on("collect", async i => {
				if (i.customId === "send") {
					await i.deferUpdate();
					await interaction.editReply({
						content: "\u200B",
						embeds: [
							new MessageEmbed()
								.setColor("#3ba55d")
								.setTitle("Sent!")
						],
						components: [buttonRowDisabled],
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
				} else {
					await i.deferUpdate();
					await interaction.editReply({
						content: "\u200B",
						embeds: [
							new MessageEmbed()
								.setColor("#ed4245")
								.setTitle("Canceled!")
						],
						components: [buttonRowDisabled],
					});
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
					components: [buttonRowDisabled],
				});
			})
		}
	},
};

export default send;
