import { MessageEmbed } from "discord.js";
import * as colors from "./colors";

const permissions = {
	general: new MessageEmbed()
		.setColor(colors.clearColor)
		.setTitle("General Permissions")
		.setDescription("```To properly function, I must be able to:```")
		.addFields([
			{
				name: "Embeded Messages",
				value: "```ts\n\"Embed Links\" Permission\n\u200b```",
				inline: true,
			},
			{
				name: "Use External Emojis",
				value: "```ts\n\"Use External Emoji\" Permission\n\u200b```",
				inline: true,
			},
			{
				name: "Use External Stickers",
				value: "```ts\n\"Use External Stickers\" Permission```",
				inline: true,
			},
		]),
	message: new MessageEmbed()
		.setColor(colors.clearColor)
		.setTitle("Message Permissions")
		.setDescription("```To properly function, I must be able to:```")
		.addFields([
			{
				name: "Send Messages",
				value: "```ts\n\"Send Messages\" Permission\n\u200b```",
				inline: true,
			},
			{
				name: "Send Threaded Messages",
				value: "```ts\n\"Send Messages in Threads\" Permission```",
				inline: true,
			},
			{
				name: "Send Embeded Messages",
				value: "```ts\n\"Embed Links\" Permission\n\u200b```",
				inline: true,
			},
			{
				name: "See this Channel Properly",
				value: "```ts\n\"View Channels\"/\"Read Messages\" Permission```",
				inline: true,
			},
			{
				name: "Ping all Roles",
				value: "```ts\n\"Mention @everyone, @here, and All Roles\" Permission```",
				inline: true,
			},
		]),

}

export default permissions;