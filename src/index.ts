import "./exports/vars";
import { client } from "./exports/client";
import * as commands from "./commands";
import logMessage from "./exports/error";
import * as activity from "./exports/activity";
import { MessageContextMenuInteraction, MessageEmbed } from "discord.js";
import { setMode } from "./exports/mode";
import { logData } from "./exports/daily_data";
import * as profileInfo from "./exports/profile_info";
import login from "./exports/login";

//Commands
client.on("interactionCreate", async (interaction) => {
	if (interaction.isCommand()) {
		const publicCommands = commands.publicCommands[interaction.commandName];
		const developerCommands = commands.developerCommands[interaction.commandName];

		if (publicCommands && publicCommands.data.name == (interaction.commandName)) {
			try {
				await publicCommands.execute(interaction);
			} catch (error) {
				await logMessage(error, "index");
			}
		} else {
			try {
				await developerCommands.execute(interaction);
			} catch (error) {
				await logMessage(error, "index & dev command");
			}
		}
	} else if (interaction.isModalSubmit()) {
		const publicCommands = commands.publicCommands[(interaction.customId).substring(0, (interaction.customId).indexOf(":"))];
		const developerCommands = commands.developerCommands[(interaction.customId).substring(0, (interaction.customId).indexOf(":"))];

		if (publicCommands && publicCommands.data.name == ((interaction.customId).substring(0, (interaction.customId).indexOf(":")))) {
			try {
				await publicCommands.modalExecute(interaction);
			} catch (error) {
				await logMessage(error, "index (modal response)");
			}
		} else {
			try {
				await developerCommands.modalExecute(interaction);
			} catch (error) {
				await logMessage(error, "index (modal response) & dev command");
			}
		}
	} else if (interaction.isButton() || interaction.isSelectMenu()) {
		const publicCommands = commands.publicCommands[(interaction.customId).substring(0, (interaction.customId).indexOf(":"))];
		const developerCommands = commands.developerCommands[(interaction.customId).substring(0, (interaction.customId).indexOf(":"))];

		if (publicCommands && publicCommands.data.name == ((interaction.customId).substring(0, (interaction.customId).indexOf(":")))) {
			try {
				if (!publicCommands.globalMessageInteractionnExecute) return;
				await publicCommands.globalMessageInteractionnExecute(interaction);
			} catch (error) {
				await logMessage(error, "index (button response)");
			}
		} else if (developerCommands && developerCommands.data.name == ((interaction.customId).substring(0, (interaction.customId).indexOf(":")))) {
			try {
				if (!developerCommands.globalMessageInteractionnExecute) return;
				await developerCommands.globalMessageInteractionnExecute(interaction);
			} catch (error) {
				await logMessage(error, "index (global button response) & dev command");
			}
		}
	} else if (interaction.isMessageContextMenu()) {
		const publicCommands = commands.publicCommands[interaction.commandName];
		const developerCommands = commands.developerCommands[interaction.commandName];

		if (publicCommands && publicCommands.data.name == (interaction.commandName)) {
			try {
				await publicCommands.contextMenuExecute(interaction);
			} catch (error) {
				await logMessage(error, "index (context command)");
			}
		} else {
			try {
				await developerCommands.contextMenuExecute(interaction);
			} catch (error) {
				await logMessage(error, "index & dev command (context command)");
			}
		}
	}
});

//On login
client.once("ready", () => {

	//Run functions on start
	for (let i = 0; i < Object.keys(commands.publicCommands).length; i++) {
		if (commands.publicCommands[Object.keys(commands.publicCommands)[i]].onReadyExecute) commands.publicCommands[Object.keys(commands.publicCommands)[i]].onReadyExecute();
	}

	//Set mode
	setMode("normal", "");

	//Set activity
	activity.setRotateStatus(true);
	activity.setNextStatus(0);

	//Start daily logging in 24 hours
	setTimeout(logData, 86400000);

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
login(process.env.DISCORD_AUTH);