import { MessageEmbed } from "discord.js";
import { commandData, CustomCommand } from "../../exports/types";
import * as colors from "../../exports/colors";

// const monthDuration = {
// 	january: 31,
// 	february: 28,
// 	march: 31,
// 	april: 30,
// 	may: 31,
// 	june: 30,
// 	july: 31,
// 	august: 31,
// 	september: 30,
// 	october: 31,
// 	november: 30,
// 	december: 31,
// }

let generate: CustomCommand = {
	data: {
		name: "generate",
		description: "Generate timers and timestamps!",
		type: "CHAT_INPUT",
		options: [
			// {
			// 	name: "timestamp",
			// 	description: "Generate a universal timestamp!",
			// 	type: 1,
			// 	options: [
			// 		{
			// 			name: "second",
			// 			description: "What second should the timestamp be?",
			// 			type: "INTEGER",
			// 			minValue: 0,
			// 			maxValue: 59,
			// 		},
			// 		{
			// 			name: "minute",
			// 			description: "What minute should the timestamp be?",
			// 			type: "INTEGER",
			// 			minValue: 0,
			// 			maxValue: 59,
			// 		},
			// 		{
			// 			name: "hour",
			// 			description: "What hour should the timestamp be?",
			// 			type: "INTEGER",
			// 			minValue: 1,
			// 			maxValue: 24,
			// 		},
			// 		{
			// 			name: "day",
			// 			description: "What day should the timestamp be?",
			// 			type: "INTEGER",
			// 			minValue: 0,
			// 			maxValue: 31,
			// 		},
			// 		{
			// 			name: "month",
			// 			description: "What month should the timestamp be?",
			// 			type: "STRING",
			// 			choices: [
			// 				{
			// 					name: "January",
			// 					value: "1"
			// 				},
			// 				{
			// 					name: "Febuary",
			// 					value: "2"
			// 				},
			// 				{
			// 					name: "March",
			// 					value: "3"
			// 				},
			// 				{
			// 					name: "April",
			// 					value: "4"
			// 				},
			// 				{
			// 					name: "May",
			// 					value: "5"
			// 				},
			// 				{
			// 					name: "June",
			// 					value: "6"
			// 				},
			// 				{
			// 					name: "July",
			// 					value: "7"
			// 				},
			// 				{
			// 					name: "August",
			// 					value: "8"
			// 				},
			// 				{
			// 					name: "September",
			// 					value: "9"
			// 				},
			// 				{
			// 					name: "October",
			// 					value: "10"
			// 				},
			// 				{
			// 					name: "November",
			// 					value: "11"
			// 				},
			// 				{
			// 					name: "December",
			// 					value: "12"
			// 				},
			// 			],
			// 		},
			// 		{
			// 			name: "year",
			// 			description: "What year should the timestamp be?",
			// 			type: "INTEGER",
			// 		},
			// 	]
			// },
			{
				name: "timer",
				description: "Generate a timer!",
				type: 1,
				options: [
					{
						name: "seconds",
						description: "In how many seconds should the timer end?",
						type: "NUMBER",
						minValue: -10000,
						maxValue: 10000,
					},
					{
						name: "minutes",
						description: "In how many minutes should the timer end?",
						type: "INTEGER",
						minValue: -10000,
						maxValue: 10000,
					},
					{
						name: "hours",
						description: "In how many hours should the timer end?",
						type: "INTEGER",
						minValue: -10000,
						maxValue: 10000,
					},
					{
						name: "days",
						description: "In how many days should the timer end?",
						type: "INTEGER",
						minValue: -10000,
						maxValue: 10000,
					},
				]
			},
		]
	},

	commandHelp: {
		name: "timer",
		fullName: "/generate timer",
		module: "hammerTime",
		keywords: [
			"time",
			"clock",
			"until",
			"to",
			"universal",
			"count",
			":",
			"sec",
			"min",
			"hour",
			"day",
		],
		helpMessage: new MessageEmbed()
			.setThumbnail("https://github.com/chr0mevillager/coyote/blob/master/src/artwork/command_icons/hammer_time.png?raw=true")
			.setColor(colors.clearColor)
			.setTitle("Timer")
			.setDescription("Create a flexible timer.\n\n```/generate timer [ Seconds ] [ Minutes ] [ Hours ] [ Days ]```")
			.addFields([
				{
					name: "Seconds",
					value: "```Type in the number of seconds the timer should last.```",
					inline: false,
				},
				{
					name: "Minutes",
					value: "```Type in the number of minutes the timer should last.```",
					inline: true,
				},
				{
					name: "Hours",
					value: "```Type in the number of hours the timer should last.```",
					inline: true,
				},
				{
					name: "Days",
					value: "```Type in the number of days the timer should last.```",
					inline: true,
				},
			]),
	},

	commandData: {
		uses: 0,
	},

	async execute(interaction) {
		(generate.commandData as commandData).uses++;

		let time = 0;

		if (interaction.options.getSubcommand() === "timestamp") {

			// Due to timezones, this will be added after the datepicker

			// let times = {
			// 	second: new Date().getSeconds(),
			// 	minute: new Date().getMinutes(),
			// 	hour: new Date().getHours(),
			// 	day: new Date().getDate(),
			// 	month: new Date().getMonth(),
			// 	year: new Date().getFullYear(),
			// };

			// for (let i = 0; i < Object.keys(times).length; i++) {
			// 	if (interaction.options.get(Object.keys(times)[i])) {
			// 		times[Object.keys(times)[i]] = interaction.options.get(Object.keys(times)[i]).value as number * 1;
			// 	}
			// }

			// time += times.second * 1;
			// time += times.minute * 60;
			// time += times.hour * 3600;
			// time += times.day * 86400;
			// time += monthDuration[Object.keys(monthDuration)[times.month]] * 86400;
			// time += (times.year - 1970) * 31540000;

		} else if (interaction.options.getSubcommand() === "timer") {
			let times = {
				seconds: 1,
				minutes: 60,
				hours: 3600,
				days: 86400,
			};

			time = Math.round(new Date().getTime() / 1000);

			for (let i = 0; i < Object.keys(times).length; i++) {
				if (interaction.options.get(Object.keys(times)[i])) {
					time += (interaction.options.get(Object.keys(times)[i]).value as number) * times[Object.keys(times)[i]];
				}
			}

			await interaction.reply({
				content: "<t:" + time + ">",
				embeds: [
					new MessageEmbed()
						.setColor(colors.successColor)
						.setTitle("Timer Started!")
						.setDescription("Your timer is set to end on <t:" + time + ">, which is in <t:" + time + ":R>.```To copy this timer anywhere, select how you would like it to be displayed, then copy the text below it.```")
						.addFields([
							{
								name: "<t:" + time + ":d>",
								value: "```<t:" + time + ":d>```",
								inline: true,
							},
							{
								name: "<t:" + time + ":f>",
								value: "```<t:" + time + ":f>```",
								inline: true,
							},
							{
								name: "<t:" + time + ":t>",
								value: "```<t:" + time + ":t>```",
								inline: true,
							},
							{
								name: "<t:" + time + ":D>",
								value: "```<t:" + time + ":D>```",
								inline: true,
							},
							{
								name: "<t:" + time + ":F>",
								value: "```<t:" + time + ":F>```",
								inline: true,
							},
							{
								name: "<t:" + time + ":T>",
								value: "```<t:" + time + ":T>```",
								inline: true,
							},
							{
								name: "<t:" + time + ":R>",
								value: "```<t:" + time + ":R>```",
								inline: true,
							},
						])
				],
				ephemeral: true,
			});
		}
	},
};

export default generate;