import { MessageEmbed } from "discord.js";

const permissions = {
	message: new MessageEmbed()
		.setColor("#2f3136")
		.setTitle("Message Permissions")
		.setDescription("```To properly function, I must be able to:```")
		.addFields([
			{
				name: "Send messages",
				value: "```ts\n\"Send Messages\" Permission```",
				inline: true,
			},
			{
				name: "Send embeded messages",
				value: "```ts\n\"Embed Links\" Permission```",
				inline: true,
			},
			{
				name: "See this channel properly",
				value: "```ts\n\"View Channels\" Permission```",
				inline: true,
			},
			{
				name: "Ping all roles",
				value: "```ts\n\"Mention @everyone, @here, and All Roles\" Permission```",
				inline: true,
			},
		]),

}

export default permissions;