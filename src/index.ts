import "./exports/vars";
import { client } from "./exports/client";
import commands from "./commands";
import { Routes } from "discord-api-types";
import { REST } from "@discordjs/rest";
import logMessage from "./exports/error";

//Commands
client.on("interactionCreate", async (interaction) => {
	if (interaction.isCommand()) {
		const command = commands[interaction.commandName];
		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);
			await logMessage(error, "index");
		}
	}
});

//On login
client.once('ready', () => {
	setHelpActivity();
	console.log("It's alive! (Probably)");


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

function setHelpActivity() {
	client.user.setActivity('/help', { type: 'LISTENING' });
	setInterval(setHelpActivity, 7200000);
}
