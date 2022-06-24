import { InteractionCollector, MessageActionRow, MessageButton, MessageCollector, MessageEmbed, MessageSelectMenu } from "discord.js";
import { commandHelp, CustomCommand } from "../../exports/types";
import * as data from "../../exports/data";
import { publicCommands } from "../index";

let moduleList = [];
let row1;
let row2
let moduleNum = 0;
let fullName = "";
let modules = []

let help: CustomCommand = {
	data: {
		name: "help",
		description: "See documentation about my commands!",
	},

	commandHelp: {
		name: "help",
		keywords: [
			"help",
		],
		module: "general",
		helpMessage: new MessageEmbed()
	},

	async modalExecute(interaction) {

	},

	async globalButtonExecute(interaction) {
		const [command, data,] = (interaction.customId).split("::");
		if (data == "module") {
			interaction.reply("yooooo")
		} else if (data == "search") {
			interaction.reply("search");
		}
	},

	async onReadyExecute() {

		//Search for modules
		for (let i = 0; i < Object.keys(publicCommands).length; i++) {
			moduleNum = i;
			if (publicCommands[Object.keys(publicCommands)[i]].commandHelp) {
				if (publicCommands[Object.keys(publicCommands)[i]].commandHelp[1]) {
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
							value: "help::" + ((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[i]).module
						});
					} else {
						console.log("e");
						//add to the description of the module
					}
				} else {
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
							value: "help::" + (publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).module,
						});
					} else {
						modules.find(element => element.value == "help::" + (publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).module).description += "\u2800\u2800" + fullName;
					}
				}
			}
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
					.setTitle("Welcome to the help center!")
					.setDescription("Find what you are looking for by looking through the modules or searching for a command!")
			],
			ephemeral: true,
			components: [row1, row2],
		});
	},
};

export default help;
