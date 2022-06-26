import {
	CommandInteraction,
	ApplicationCommandDataResolvable,
	CacheType,
	ModalSubmitInteraction,
	ButtonInteraction,
	SelectMenuInteraction,
	MessageEmbed,
	MessageContextMenuInteraction,
	UserContextMenuInteraction,
} from 'discord.js';

export interface CustomCommand {
	data: ApplicationCommandDataResolvable;
	commandHelp?: Array<commandHelp> | commandHelp;
	execute(interaction: CommandInteraction<CacheType> | MessageContextMenuInteraction<CacheType> | UserContextMenuInteraction<CacheType>): void | Promise<void>;
	modalExecute?(interaction: ModalSubmitInteraction<CacheType>): void | Promise<void>;
	globalMessageInteractionnExecute?(interaction: ButtonInteraction<CacheType> | SelectMenuInteraction<CacheType>): void | Promise<void>;
	onReadyExecute?(): void | Promise<void>;
}

export type mode = "normal" | "update" | "warning";

export type commandHelp = {
	name: string,
	fullName?: string,
	module: string,
	keywords: any[],
	helpMessage: MessageEmbed,
}