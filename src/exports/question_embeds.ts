import { MessageEmbed } from "discord.js";
import permissions from "./perms";
import * as colors from "./colors";

export const question = (image: string, extraText: string) => new MessageEmbed()
	.setTitle("")
	.setDescription("")
	.setColor("#2f3136")
	.setImage(image)
	.setFooter({ text: extraText })


export const send = new MessageEmbed()
	.setTitle("")
	.setDescription("")
	.setColor(colors.clearColor)
	.setImage("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/send/message_sent.png?raw=true");

export const cancel = new MessageEmbed()
	.setTitle("")
	.setDescription("")
	.setColor(colors.clearColor)
	.setImage("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/send/canceled.png?raw=true");

export const timedOut = new MessageEmbed()
	.setTitle("")
	.setDescription("")
	.setColor(colors.clearColor)
	.setImage("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/send/timed_out.png?raw=true");

export const invalidPerms = permissions.message;

export const warning = new MessageEmbed()
	.setTitle("")
	.setDescription("")
	.setColor(colors.clearColor)
	.setImage("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/send/ready_to_send.png?raw=true");