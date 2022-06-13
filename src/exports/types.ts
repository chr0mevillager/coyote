import {
	CommandInteraction,
	ApplicationCommandDataResolvable,
	CacheType,
	ModalSubmitInteraction,
} from 'discord.js';

export interface CustomCommand {
	data: ApplicationCommandDataResolvable;
	execute(interaction: CommandInteraction<CacheType>): void | Promise<void>;
	modalExecute(interaction: ModalSubmitInteraction<CacheType>): void | Promise<void>;
}

export type mode = "normal" | "update" | "warning";