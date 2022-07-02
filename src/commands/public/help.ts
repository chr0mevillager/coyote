import { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu, Modal, ModalActionRowComponent, TextInputComponent } from "discord.js";
import { commandData, commandHelp, CustomCommand } from "../../exports/types";
import { publicCommands } from "../index";
import logMessage from "../../exports/error";
import * as colors from "../../exports/colors";
import * as emoji from "../../exports/emoji";

let moduleNum;
let row1;
let row2;
let fullName = "";
let modules = [];
let commands = [];

const inputModal = new MessageActionRow<ModalActionRowComponent>()
	.addComponents(
		new TextInputComponent()
			.setCustomId("search")
			.setLabel("What do you want to search for?")
			.setStyle("SHORT")
			.setPlaceholder("Ex: message")
			.setRequired(true)
			.setMaxLength(20)
			.setMinLength(3)
	);
const modal = new Modal()
	.setTitle("Search")
	.setCustomId("help::modal")
	.setComponents(inputModal)


let help: CustomCommand = {
	data: {
		name: "help",
		description: "See documentation about my commands!",
	},

	commandHelp: {
		name: "help",
		keywords: [
			"help",
			"info",
			"what",
			"why",
			"how",
		],
		module: "general",
		helpMessage: new MessageEmbed()
			.setTitle("Help")
			.setDescription("```Get help with anything you need!```")
			.setColor(colors.clearColor)
	},

	commandData: {
		uses: 0,
		buttons: {
			search: 0,
			dropdown: 0,
			quickstart: 0,
		}
	},

	async modalExecute(interaction) {
		(help.commandData as commandData).buttons["search"]++;
		interaction.reply({
			embeds: findCommand(interaction.fields.getTextInputValue("search").toLowerCase()),
			ephemeral: true,
		})
	},

	async globalMessageInteractionnExecute(interaction) {
		try {
			const [command, data,] = (interaction.customId).split("::");

			if (data == "module" && interaction.isSelectMenu()) {
				(help.commandData as commandData).buttons["dropdown"]++;
				interaction.reply({
					embeds: findModule(interaction.values[0]),
					ephemeral: true,
				})
			} else if (data == "search") {
				interaction.showModal(modal);
			} else if (data == "quickStart") {
				(help.commandData as commandData).buttons["quickstart"]++;
				interaction.reply({
					embeds: [
						new MessageEmbed()
							.setColor(colors.successColor)
							.setTitle("Quick-Start Guide")
							.setDescription("Get all of the information you need to start out with the Embeds Bot!")
							.addFields([
								{
									name: "📨\u2800Messages",
									value: "```js\nQuickly send a fancy message by typing \"/send command\".``````Then, type in a title and description. Hit enter, and then hit the send button.\n\u200b```",
									inline: true,
								},
								{
									name: "📊\u2800Polls",
									value: "```js\nEasily send a simple poll by typing \"/send poll\".``````Then, type in a question and 2-4 answers. Hit enter, and then hit the send button.\n\u200b```",
									inline: true,
								},
								{
									name: "🎁\u2800Giveaways",
									value: "```js\nEffectively send a robust giveaway by typing \"/send giveaway\".``````Then, type in an item and how many winners there should be. Hit enter, and then hit the send button.```",
									inline: true,
								},
								{
									name: "Don't Stress!",
									value: "```If you ever make a typo, don\'t worry!``````js\nSimply use the \"Edit\" command! Search for the edit command in the help center to see how to find and use it.```",
									inline: false,
								},
							])
					],
					ephemeral: true,
				})
			}
		} catch (error) {
			logMessage(error, "/help button", interaction);
		}
	},

	async onReadyExecute() {
		for (let i = 0; i < Object.keys(publicCommands).length; i++) {
			//Get list of commands
			moduleNum = i;
			if (publicCommands[Object.keys(publicCommands)[i]].commandHelp) {
				if (publicCommands[Object.keys(publicCommands)[i]].commandHelp[1]) {
					for (let i = 0; i < (publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>).length; i++) {
						commands.push((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[i]);
					}
				} else {
					commands.push(publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp);
				}
			}
		}
		//Make dropdown
		commands.forEach(command => {
			if (command.fullName) {
				fullName = command.fullName
			} else {
				fullName = "/" + command.name
			}

			if (!modules.find(module => module.value == command.module)) {
				modules.push({
					label: (command.module.charAt(0).toUpperCase() + command.module.slice(1)),
					description: fullName,
					value: (command.module),
					emoji: emoji.main[command.module],
				});
			} else {
				modules.find(module => module.value == command.module).description += "\u2800\u2800" + fullName;
			}
		});
		row1 = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId("help::module")
					.setPlaceholder("<:DropdownTiles_White:992900389408079892> Select a Module")
					.addOptions(modules)
			)
		row2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("help::quickStart")
					.setLabel("Quick-Start Guide")
					.setEmoji(emoji.white.timer)
					.setStyle("SUCCESS"),
				new MessageButton()
					.setCustomId("help::search")
					.setLabel("Search")
					.setEmoji(emoji.white.search)
					.setStyle("PRIMARY"),
			)
	},

	async execute(interaction) {
		try {
			(help.commandData as commandData).uses++;

			await interaction.reply({
				embeds: [
					new MessageEmbed()
						.setColor(colors.mainColor)
						.setTitle("Welcome to the help center!")
						.setDescription("Find what you are looking for by looking through the modules or searching for a command!")
				],
				ephemeral: true,
				components: [row1, row2],
			});
		} catch (error) {
			logMessage(error, "/help command", interaction);
		}
	},
};

export default help;

function findModule(module: string) {
	let results = [];
	results.push(
		new MessageEmbed()
			.setColor(colors.mainColor)
			.setTitle(module.charAt(0).toUpperCase() + module.slice(1) + " Module")
			.setDescription("")
	)
	commands.forEach(command => {
		if (command.module == module && results.length < 10) {
			results.push(command.helpMessage);
		}
	});
	return results;
}

function findCommand(search: string) {
	let results = [];

	results.push(
		new MessageEmbed()
			.setColor(colors.successColor)
			.setTitle("Here are your Results")
			.setDescription("")
	)
	commands.forEach(command => {
		let match = command.keywords.find(element => {
			if (element.includes(search) || search.includes(element)) {
				return true;
			}
		});

		if (match !== undefined || command.module.includes(search) || search.includes(command.module) && search && results.length < 10) {
			results.push(command.helpMessage);
		}
	});
	if (results.length > 1) {
		return results;
	} else {
		return [
			new MessageEmbed()
				.setColor(colors.cancelColor)
				.setTitle("No Results were Found")
				.setDescription("")
		]
	}

}