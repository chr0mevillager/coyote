import {
	ColorResolvable,
	MessageEmbed,
} from "discord.js";
import sendUpdate from "../../exports/send_update";
import { client } from "../../exports/client";
import * as buttons from "../../exports/send_buttons";

export default async function messageInteraction(interaction) {

	//Inputs ---
	let title: string = "\u200B";
	let description: string = "\u200B";
	let image: string = "";

	title = interaction.options.getString("title");
	description = interaction.options.getString("description");
	if (interaction.options.getString("image") && interaction.options.getString("image").match(/^((https:\/\/)|(http:\/\/))\w{2,100}(\.{1,10}\w{1,100}){1,100}(\/\w{0,100}){0,100}/gm)) image = interaction.options.getString("image");

	if (title.length > 256) title = title.slice(0, 256);
	if (description.length > 4000) description = description.slice(0, 4000);

	description = JSON.parse('"' + description.replace(/"/g, '\\"') + '"');
	title = JSON.parse('"' + title.replace(/"/g, '\\"') + '"');

	//Other Variables
	let updateSent = false;
	let uuid = interaction.id;

	//Embed
	const userMessage = (color: string) => new MessageEmbed()
		.setColor(color as ColorResolvable)
		.setTitle(title)
		.setDescription(description + "\n" + "\u200B")
		.setImage(image)
		.setFooter({ text: "Sent by: " + interaction.user.username, iconURL: interaction.user.avatarURL() })

	//Send Preview ---
	await interaction.reply({
		content: "**Here is your message:**",
		embeds: [userMessage("#2f3136")],
		components: [buttons.buttonRow(uuid)],
		ephemeral: true,
	});

	//Start Collector ---
	let collector = interaction.channel.createMessageComponentCollector({ filter: (i) => i.customId === `${uuid}::send` || i.customId === `${uuid}::cancel`, time: 60000 });
	collector.on("collect", async (i) => {

		//Send
		if (i.customId === uuid + "::send") {
			try {
				await (client.channels.cache.find((channel) => (channel as any).id === interaction.channelId) as any).send({
					embeds: [userMessage("#2f3136")],
				});

				await interaction.editReply({
					content: "**Sent!**",
					embeds: [userMessage("#3ba55d")],
					components: [buttons.buttonRowDisabled(uuid)],
				});
			} catch {
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
					components: [buttons.buttonRowDisabled(uuid)],
				});
			}
			sendUpdate(i, updateSent);

			//Cancel
		} else if (i.customId === uuid + "::cancel") {
			await interaction.editReply({
				content: "**Canceled!**",
				embeds: [userMessage("#2f3136")],
				components: [buttons.buttonRowDisabled(uuid)],
			});
			sendUpdate(i, updateSent);
		}
	});
	//Timed Out ---
	collector.on("end", async i => {
		if (updateSent) return;
		await interaction.editReply({
			content: "**Timed Out!**",
			embeds: [userMessage("#2f3136")],
			components: [buttons.buttonRowDisabled(uuid)],
		});
	})
}