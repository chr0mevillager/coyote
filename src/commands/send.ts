import {
	MessageActionRow,
	MessageButton,
	MessageEmbed,
	CommandInteraction,
	CacheType,
	InteractionCollector,
	MessageComponentInteraction,
	GuildMember,
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
				name: "message",
				description: "Send a fancy message!",
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
						name: "image",
						description: "What do you want the image to be?",
						type: "STRING",
						required: false,
					},
				]
			},
		],
	},

	async execute(interaction) {
		if (!(interaction.member as GuildMember).permissions.has("ADMINISTRATOR")) {
			await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("#ed4245")
						.setTitle("You need to be a server admin to use this command!")
				],
				ephemeral: true,
			});
			return;
		}
		//Blank Vars
		let title: string = "\u200B";
		let description: string = "\u200B";
		let image: string = "";

		//Get selected variables
		title = interaction.options.getString("title");
		description = interaction.options.getString("description");
		if (interaction.options.getString("image") && interaction.options.getString("image").match(/^((https:\/\/)|(http:\/\/))\w{2,100}(\.{1,10}\w{1,100}){1,100}(\/\w{0,100}){0,100}/gm)) image = interaction.options.getString("image");

		if (title.length > 256) title = title.slice(0, 256);
		if (description.length > 4000) description = description.slice(0, 4000);

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
		//Message command
		if (interaction.options.getSubcommand() == "message") {
			let uuid = uuidv4();
			//Send preview
			await interaction.reply({
				content: "**Here is your message:**",
				embeds: [
					new MessageEmbed()
						.setColor("#2f3136")
						.setTitle(title)
						.setDescription(description + "\n" + "\u200B")
						.setImage(image)
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
								.setImage(image)
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
	},
};

export default send;