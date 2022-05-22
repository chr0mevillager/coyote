import { MessageEmbed } from "discord.js";

export const question = new MessageEmbed()
	.setTitle("")
	.setDescription("")
	.setColor("#2f3136")
	.setImage("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/send/ready_to_send.png?raw=true");

export const send = new MessageEmbed()
	.setTitle("")
	.setDescription("")
	.setColor("#2f3136")
	.setImage("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/send/message_sent.png?raw=true");

export const cancel = new MessageEmbed()
	.setTitle("")
	.setDescription("")
	.setColor("#2f3136")
	.setImage("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/send/canceled.png?raw=true");

export const timedOut = new MessageEmbed()
	.setTitle("")
	.setDescription("")
	.setColor("#2f3136")
	.setImage("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/send/timed_out.png?raw=true");

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
	.setImage("https://github.com/chr0mevillager/embeds-bot/blob/master/src/artwork/send/invalid_perms.png?raw=true");