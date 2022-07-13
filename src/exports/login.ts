import { MessageEmbed } from "discord.js";
import * as activity from "./activity";
import { client } from "./client";
import * as colors from "./colors";
import { logData } from "./daily_data";
import { setMode } from "./mode";
import * as profileInfo from "./profile_info";

export default async function () {
	//Send login messages
	if (client.application.id == "942083941307912193") {
		(client.channels.cache.find((channel) => (channel as any).id === process.env.LOGGING_CHANNEL) as any).send({
			content: "@everyone",
			embeds: [
				new MessageEmbed()
					.setColor(colors.mainColor)
					.setTitle("Bot Online!")
					.setDescription("Online at <t:" + Math.floor(client.readyAt.getTime() / 1000) + ":D> <t:" + Math.floor(client.readyAt.getTime() / 1000) + ":T>\n\n||`" + Math.floor(client.readyAt.getTime() / 1000) + "`||\n\n" + "Version `" + profileInfo.versionNumber + "`")
			],
		});
	} else {
		console.log("Bot online!");
	}

	//Set mode
	setMode("normal", "");

	//Set activity
	activity.setRotateStatus(true);
	activity.setNextStatus(0);

	//Start daily logging in 24 hours
	setTimeout(logData, 86400000 /* 0000 */);
}