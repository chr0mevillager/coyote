import {
	CommandInteraction,
	ApplicationCommandDataResolvable,
	CacheType,
	ModalSubmitInteraction,
	MessageEmbed,
} from 'discord.js';

export interface CustomCommand {
	data: ApplicationCommandDataResolvable;
	execute(interaction: CommandInteraction<CacheType>): void | Promise<void>;
	modalExecute(interaction: ModalSubmitInteraction<CacheType>): void | Promise<void>;
	onReadyExecute(): void | Promise<void>;
}

export type mode = "normal" | "update" | "warning";

export type commandHelp = {
	name: string,
	keywords: any[],
	helpMessage,
}