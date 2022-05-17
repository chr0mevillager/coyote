import "./exports/vars";
import { client } from "./exports/client";
import commands from "./commands";
import logMessage from "./exports/error";
import setBotActivity from "./exports/activity";
import { MessageEmbed } from "discord.js";

//Commands
client.on("interactionCreate", async (interaction) => {
	if (interaction.isCommand()) {
		const command = commands[interaction.commandName];
		try {
			await command.execute(interaction);
		} catch (error) {
			await logMessage(error, "index");
		}
	}
});

//On login
client.once('ready', () => {

	setBotActivity(0);
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
		Object.values(commands).forEach((command) => {
			guild.commands.create(command.data);
		});
	}

	//Creates commands in all guilds
	Object.values(commands).forEach((command) => {
		client.application.commands.create(command.data);
	});

});

//Login
client.login(process.env.DISCORD_AUTH);
