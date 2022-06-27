import { GuildMember, MessageActionRow, MessageContextMenuInteraction, MessageEmbed, Modal, ModalActionRowComponent, TextInputComponent } from "discord.js";
import { CustomCommand } from "../../exports/types";

const inputModalTitle = new MessageActionRow<ModalActionRowComponent>()
	.addComponents(
		new TextInputComponent()
			.setCustomId("title")
			.setLabel("What should the new title be?")
			.setStyle("SHORT")
			.setRequired(true)
			.setMaxLength(256),
	);

const inputModalDescription = new MessageActionRow<ModalActionRowComponent>()
	.addComponents(
		new TextInputComponent()
			.setCustomId("description")
			.setLabel("What should the new description be?")
			.setStyle("PARAGRAPH")
			.setRequired(true)
			.setMaxLength(4000),
	);

const inputModalImage = new MessageActionRow<ModalActionRowComponent>()
	.addComponents(
		new TextInputComponent()
			.setCustomId("image")
			.setLabel("What should the image be?")
			.setStyle("SHORT")
			.setRequired(false)
			.setMaxLength(300),
	);

let modal = (interactionID: string) => new Modal()
	.setTitle("Message Editor")
	.setCustomId("Edit::" + interactionID + "::modal")
	.setComponents(inputModalTitle, inputModalDescription, inputModalImage)

let edit: CustomCommand = {
	data: {
		name: "Edit",
		type: "MESSAGE",
	},

	commandHelp: {
		name: "edit",
		fullName: "•Edit",
		keywords: [
			"edit",
			"mod",
			"change",
		],
		module: "embeds",
		helpMessage: new MessageEmbed()
			.setColor("#2f3136")
			.setTitle("Edit")
			.setDescription("```Edit a previously sent message!```")
			.addFields([
				{
					name: "For PC",
					value: "```js\n1. Right click on the message ``````2. Going to the \"Apps\" catagory. ``````js\n3. Click \"Edit\" ``````js\n4. Type in your updated message.```",
					inline: true,
				},
				{
					name: "For Mobile",
					value: "```js\n1. Hold down on the message``````js\n2. Going to the \"Apps\" catagory. ``````js\n3. Tap \"Edit\" ``````js\n4. Type in your updated message.```",
					inline: true,
				},
			]),
	},

	async contextMenuExecute(interaction) {
		if ((interaction as MessageContextMenuInteraction).targetMessage.author.id == "942083941307912193" || (interaction as MessageContextMenuInteraction).targetMessage.author.id == "968997421726195832") {
			if (!interaction.channel) {
				await interaction.reply({
					embeds: [
						new MessageEmbed()
							.setColor("#ff6c08")
							.setTitle("This Command can Only be Used in Servers!")
							.setDescription("You must be an administrator to edit a message.")
					],
					ephemeral: true,
				});
				return;
			}
			else if (!(interaction.member as GuildMember).permissions.has("ADMINISTRATOR")) {
				await interaction.reply({
					embeds: [
						new MessageEmbed()
							.setColor("#ff6c08")
							.setTitle("Missing Admin Permissions!")
							.setDescription("You must be an administrator to edit a message.")
					],
					ephemeral: true,
				});
				return;
			}
			interaction.showModal(modal((interaction as MessageContextMenuInteraction).targetMessage.id));
		} else {
			await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor("#ff6c08")
						.setTitle("You can only Edit Messages Sent by Me!")
						.setDescription("This command cannot be used with messages from other users.")
				],
				ephemeral: true,
			});
		}
	},

	async modalExecute(interaction) {
		const [command, messageID, modal] = (interaction.customId).split("::");

		let title = interaction.fields.getTextInputValue("title");
		let description = interaction.fields.getTextInputValue("description");
		let image = "";

		if (interaction.fields.getTextInputValue("image") && interaction.fields.getTextInputValue("image").match(/^((https:\/\/)|(http:\/\/))\w{2,100}(\.{1,10}\w{1,100}){1,100}(\/\w{0,100}){0,100}/gm)) image = interaction.fields.getTextInputValue("image");

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

		(await interaction.channel).messages.fetch(messageID).then(message => message.edit({
			embeds: [
				new MessageEmbed()
					.setTitle(title)
					.setDescription(description)
					.setFooter({ text: "Edited By: " + interaction.user.username, iconURL: interaction.user.avatarURL() })
					.setColor("#2f3136")
					.setImage(image)
			]
		}));
		interaction.reply({
			embeds: [
				new MessageEmbed()
					.setTitle("Message Updated!")
					.setColor("#389af0")
			],
			ephemeral: true,
		})
	},
};

export default edit;