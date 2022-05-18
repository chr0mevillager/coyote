import "./exports/vars";
import { client } from "./exports/client";
import * as commands from "./commands";
import logMessage from "./exports/error";
import * as activity from "./exports/activity";
import { MessageEmbed } from "discord.js";

//Commands
client.on("interactionCreate", async (interaction) => {

	if (interaction.isCommand()) {

		const publicCommands = commands.publicCommands[interaction.commandName];
		const developerCommand = commands.developerCommands[interaction.commandName];

		if (publicCommands && publicCommands.data.name == (interaction.commandName)) {
			try {
				await publicCommands.execute(interaction);
			} catch (error) {
				await logMessage(error, "index");
			}
		} else {
			try {
				await developerCommand.execute(interaction);
			} catch (error) {
				await logMessage(error, "index");
			}
		}
	}
});

//On login
client.once('ready', () => {

	activity.setRotateStatus(true);
	activity.setNextStatus(0);

	(client.channels.cache.find((channel) => (channel as any).id === process.env.LOGGING_CHANNEL) as any).send({
		content: "@everyone",
		embeds: [
			new MessageEmbed()
				.setColor("#389af0")
				.setTitle("Bot Online!")
				.setDescription("Online <t:" + Math.round(new Date().getTime() / 1000) + ":R>.")
		],
	});

	//Creates commands in testing guild
	const guild = client.guilds.cache.get(process.env.SLASH_COMMAND_TESTING_GUILD);
	if (guild) {
		Object.values(commands.developerCommands).forEach((command) => {
			guild.commands.create(command.data);
		});
	}

	//Creates commands in all guilds
	Object.values(commands.publicCommands).forEach((command) => {
		client.application.commands.create(command.data);
	});

});

//Login
client.login(process.env.DISCORD_AUTH);
