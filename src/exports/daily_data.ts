import { MessageEmbed } from "discord.js";
import { client } from "./client";
import * as activity from "../exports/activity";
import * as commandData from "../exports/data";

/**Start logging data regarding the bot every 24 hours */
export function logData() {
	(client.channels.cache.find((channel) => (channel as any).id === process.env.LOGGING_CHANNEL) as any).send({
		embeds: [
			new MessageEmbed()
				.setColor("#389af0")
				.setTitle("Main")
				.addFields(
					{ name: "\u2800\nBot:", value: "\u2800" },
					{ name: "`Server Count:`", value: (client.guilds.cache.size + ""), inline: true },
				),
			new MessageEmbed()
				.setColor("#389af0")
				.setTitle("Commands")
				.addFields(
					{ name: "\u2800\n\/send message", value: "\u2800" },
					{ name: "`Command Uses:`", value: commandData.data.message.uses + "", inline: true },
					{ name: "`Send Button Uses:`", value: commandData.data.message.buttonUses.send + "", inline: true },
					{ name: "`Cancel Button Uses:`", value: commandData.data.message.buttonUses.cancel + "", inline: true },
					{ name: "`Timeout:`", value: (commandData.data.message.uses - (commandData.data.message.buttonUses.send + commandData.data.message.buttonUses.cancel)) + "", inline: true },
					{ name: "`Intuition Score:`", value: (commandData.data.message.buttonUses.send / commandData.data.message.uses).toFixed(4) as any * 100 + "%", inline: true },
					{ name: "`Popularity per Server:`", value: (commandData.data.message.buttonUses.send / client.guilds.cache.size).toFixed(4) as any * 100 + "%", inline: true },

					{ name: "\u2800\n\/send poll", value: "\u2800" },
					{ name: "`Command Uses:`", value: commandData.data.poll.uses + "", inline: true },
					{ name: "`Send Button Uses:`", value: commandData.data.poll.buttonUses.send + "", inline: true },
					{ name: "`Cancel Button Uses:`", value: commandData.data.poll.buttonUses.cancel + "", inline: true },
					{ name: "`Replies:`", value: commandData.data.poll.buttonUses.response + "", inline: true },
					{ name: "`Timeout:`", value: (commandData.data.poll.uses - (commandData.data.poll.buttonUses.send + commandData.data.poll.buttonUses.cancel)) + "", inline: true },
					{ name: "`Intuition Score:`", value: (commandData.data.poll.buttonUses.send / commandData.data.poll.uses).toFixed(4) as any * 100 + "%", inline: true },
					{ name: "`Popularity per Server:`", value: (commandData.data.poll.buttonUses.send / client.guilds.cache.size).toFixed(4) as any * 100 + "%", inline: true },

					{ name: "\u2800\n\/help", value: "\u2800" },
					{ name: "`Command Uses:`", value: commandData.data.help.uses + "", inline: true },

					{ name: "\u2800\n\/info", value: "\u2800" },
					{ name: "`Command Uses:`", value: commandData.data.info.uses + "", inline: true },
				),
		],
	});
	setTimeout(logData, 86400000);
}