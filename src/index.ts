import "./exports/vars";
import { client } from "./exports/client";
import commands from "./commands";

//Commands
client.on("interactionCreate", async (interaction) => {
	if (interaction.isCommand()) {
		const command = commands[interaction.commandName];
		try {
			await command.execute(interaction);
		} catch (err) {
			console.error(err);
			await interaction.reply({
				content: "You just found an ultra-rare bug!",
				ephemeral: true,
			});
		}
	}
});

//On login
client.once('ready', () => {
	console.log("It's alive! (Probably)");
	client.user.setActivity('/help', { type: 'LISTENING' });
	const guild = client.guilds.cache.get(process.env.SLASH_COMMAND_TESTING_GUILD);
	if (guild) {
		Object.values(commands).forEach((command) => {
			guild.commands.create(command.data);
		});
	}
});

//Login
client.login(process.env.DISCORD_AUTH);
