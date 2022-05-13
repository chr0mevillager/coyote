import { MessageEmbed } from "discord.js";

//Increases the size of the embed for consistency
const width = "\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800\u2800";

export const question = (content: string) => new MessageEmbed()
	.setTitle("Here is Your " + content + ":")
	.setDescription("Would you like to send?\n" + width)
	.setColor("#389af0")
	.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/send.png?raw=true")

export const send = new MessageEmbed()
	.setTitle("Sent")
	.setDescription(width)
	.setColor("#3aef3a")
	.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/send_success.png?raw=true")

export const cancel = new MessageEmbed()
	.setTitle("Canceled")
	.setDescription(width)
	.setColor("#ff6c08")
	.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/send_cancel.png?raw=true")

export const timedOut = new MessageEmbed()
	.setTitle("Timed Out")
	.setDescription(width)
	.setColor("#ff6c08")
	.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/timed_out.png?raw=true")

export const invalidPerms = new MessageEmbed()
	.setTitle("Invalid Permissions")
	.setDescription("Please make sure I have the correct permissions to:\n\u2800")
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
	.setColor("#ff6c08")
	.setThumbnail("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/invalid_perms.png?raw=true")