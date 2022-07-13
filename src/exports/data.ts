import { MessageEmbed } from "discord.js";
import { publicCommands } from "../commands";
import { client } from "./client";
import { commandData, commandHelp } from "./types";
import * as colors from "./colors";

/** Get a list of embeds which contain the data collected through command usage. Pass through the top message embed. */
export function getData(topMessage: MessageEmbed) {
	let currentCommand;
	let commandInfo = [];
	let moduleNum = 0;
	for (let i = 0; i < Object.keys(publicCommands).length; i++) {
		moduleNum = i;
		if (publicCommands[Object.keys(publicCommands)[i]].commandData) {
			if (publicCommands[Object.keys(publicCommands)[i]].commandData[1]) {
				for (let i = 0; i < (publicCommands[Object.keys(publicCommands)[moduleNum]].commandData as Array<commandData>).length; i++) {
					currentCommand = (publicCommands[Object.keys(publicCommands)[moduleNum]].commandData as Array<commandData>)[i];
					currentCommand["name"] = ((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[i]).name;
					currentCommand["module"] = ((publicCommands[Object.keys(publicCommands)[moduleNum]].commandHelp as Array<commandHelp>)[i]).module;
					commandInfo.push(currentCommand);
				}
			} else {
				currentCommand = publicCommands[Object.keys(publicCommands)[i]].commandData as commandData;
				currentCommand["name"] = (publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).name;
				currentCommand["module"] = (publicCommands[Object.keys(publicCommands)[i]].commandHelp as commandHelp).module;
				commandInfo.push(currentCommand);
			}
		}
	}

	let embeds = [topMessage];

	commandInfo.forEach(command => {
		if (!embeds.find(embeds => embeds.title.toLowerCase() == command.module)) {
			let embed = new MessageEmbed()
				.setTitle(command.module.charAt(0).toUpperCase() + command.module.slice(1))
				.setDescription("")
				.setColor(colors.clearColor)
				.addFields([
					{
						name: command.name.charAt(0).toUpperCase() + command.name.slice(1),
						value: "\u200b",
						inline: false,
					},
					{
						name: "Command Uses",
						value: "```" + command.uses + "```",
						inline: true,
					},
					{
						name: "Popularity / Server",
						value: "```" + (command.uses / client.guilds.cache.size * 100).toFixed(4) + "%```",
						inline: true,
					},
				]);

			if (command.buttons) {
				for (let i = 0; i < (Object.keys(command.buttons).length); i++) {
					embed.addField(Object.keys(command.buttons)[i].charAt(0).toUpperCase() + Object.keys(command.buttons)[i].slice(1), "```" + command.buttons[Object.keys(command.buttons)[i]] + "```", true);
				}
				if (command.buttons["send"] && command.buttons["cancel"]) {
					embed.addField("Timeout", "```" + (command.uses - command.buttons.send) + "```", true);
					embed.addField("Intuition", "```" + ((command.buttons.send / client.guilds.cache.size) * 100).toFixed(4) + "%```", true);
				}
			}
			embeds.push(embed);
		} else {
			let index = embeds.findIndex(embed => {
				return (embed.title).toLowerCase() == command.module;
			});
			embeds[Object.keys(embeds)[index]].addField("\u200b", "\u200b", false);
			embeds[Object.keys(embeds)[index]].addField(command.name.charAt(0).toUpperCase() + command.name.slice(1), "\u200b", false);
			embeds[Object.keys(embeds)[index]].addField("Command Uses", "```" + command.uses + "```", true);
			embeds[Object.keys(embeds)[index]].addField("Popularity / Server", "```" + (command.uses / client.guilds.cache.size * 100).toFixed(4) + "%```", true);

			if (command.buttons) {
				for (let i = 0; i < (Object.keys(command.buttons).length); i++) {
					embeds[Object.keys(embeds)[index]].addField(Object.keys(command.buttons)[i].charAt(0).toUpperCase() + Object.keys(command.buttons)[i].slice(1), "```" + command.buttons[Object.keys(command.buttons)[i]] + "```", true);
				}
				if (command.buttons["send"] && command.buttons["cancel"]) {
					embeds[Object.keys(embeds)[index]].addField("Timeout", "```" + (command.uses - command.buttons.send - command.buttons.cancel) + "```", true);
					embeds[Object.keys(embeds)[index]].addField("Intuition", "```" + ((command.buttons.send / client.guilds.cache.size) * 100).toFixed(4) + "%```", true);
				}
			}
		}
	});

	return embeds;
}