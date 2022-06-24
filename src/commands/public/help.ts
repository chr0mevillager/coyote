import { InteractionCollector, MessageActionRow, MessageButton, MessageCollector, MessageEmbed, MessageSelectMenu, Modal, ModalActionRowComponent, TextInputComponent } from "discord.js";
import { commandHelp, CustomCommand } from "../../exports/types";
import * as data from "../../exports/data";
import { publicCommands } from "../index";

let moduleList = [];
let row1;
let row2
let moduleNum = 0;
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
			.setTitle("/help")
			.setDescription("Get help with ")
			.setColor("#2f3136")
	},

	async modalExecute(interaction) {
		interaction.reply({
			embeds: findCommand(interaction.fields.getTextInputValue("search")),
			ephemeral: true,
		})
	},

	async globalButtonExecute(interaction) {
		const [command, data,] = (interaction.customId).split("::");
		if (data == "module" && interaction.isSelectMenu()) {
			interaction.reply({
				embeds: findModule(interaction.values[0]),
				ephemeral: true,
			})
		} else if (data == "search") {
			interaction.showModal(modal);
		}
	},

	async onReadyExecute() {
		for (let i = 0; i < Object.keys(publicCommands).length; i++) {
			//Search for modules
			moduleNum = i;
			if (publicCommands[Object.keys(publicCommands)[i]].commandHelp) {
				if (publicCommands[Object.keys(publicCommands)[i]].commandHelp[1]) {
					//Commands
					for (let i = 0; i < (publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>).length; i++) {
						commands.push((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[i]);
					}
					//Modules
					if (!moduleList.includes((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[0].module)) {
						moduleList.push((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[0].module);
						fullName = "";
						for (let i = 0; i < (publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>).length; i++) {
							if ((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[i].fullName) {
								fullName += (publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[i].fullName + "\u2800\u2800";
							} else {
								fullName += "/" + (publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[i].name + "\u2800\u2800";
							}
						}
						if (!modules.includes((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[0].module)) modules.push({
							label: (((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[i]).module).charAt(0).toUpperCase() + (((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[i]).module).slice(1),
							description: fullName,
							value: ((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[i]).module
						});
					}
				} else {
					//Commands
					commands.push(publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp);
					//Modules
					if ((publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).fullName) {
						fullName = (publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).fullName;
					} else {
						fullName = "/" + (publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).name;
					}

					if (!moduleList.includes((publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).module)) {
						moduleList.push((publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).module);
						modules.push({
							label: ((publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).module).charAt(0).toUpperCase() + ((publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).module).slice(1),
							description: fullName,
							value: (publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).module,
						});
					} else {
						modules.find(module => module.value == (publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).module).description += "\u2800\u2800" + fullName;
					}
				}
			}
			//Make a list of commands

		}


		row1 = new MessageActionRow()
			.addComponents(
				new MessageSelectMenu()
					.setCustomId("help::module")
					.setPlaceholder("Select a Module")
					.addOptions(modules)
			)
		row2 = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId("help::search")
					.setLabel("Search 🔍")
					.setStyle("PRIMARY")
			)
	},

	async execute(interaction) {
		data.commandUsed("help");

		await interaction.reply({
			embeds: [
				new MessageEmbed()
					.setColor("#389af0")
					.setTitle("Welcome to the help center!")
					.setDescription("Find what you are looking for by looking through the modules or searching for a command!")
			],
			ephemeral: true,
			components: [row1, row2],
		});
	},
};

export default help;

function findModule(module: string) {
	let results = [];
	results.push(
		new MessageEmbed()
			.setColor("#389af0")
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
			.setColor("#389af0")
			.setTitle("Here are your results:")
			.setDescription("")
	)
	commands.forEach(command => {
		let match = command.keywords.find(element => {
			if (element.includes(search) || search.includes(element)) {
				return true;
			}
		});

		if (match !== undefined || command.module == search && search && results.length < 10) {
			results.push(command.helpMessage);
		}
	});
	if (results.length > 1) {
		return results;
	} else {
		return [
			new MessageEmbed()
				.setColor("#ff6c08")
				.setTitle("No results were found")
				.setDescription("")
		]
	}

}