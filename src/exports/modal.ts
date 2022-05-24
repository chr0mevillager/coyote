import { MessageActionRow, Modal, ModalActionRowComponent, TextInputComponent } from "discord.js";


const inputRow1 = (uuid: string) => new MessageActionRow<ModalActionRowComponent>()
	.addComponents(
		new TextInputComponent()
			.setCustomId(uuid + "::title")
			.setLabel("title text")
			.setStyle("SHORT")
	);

const inputRow2 = (uuid: string) => new MessageActionRow<ModalActionRowComponent>()
	.addComponents(
		new TextInputComponent()
			.setCustomId(uuid + "::description")
			.setLabel("description text")
			.setStyle("PARAGRAPH")
	);

export const message = (uuid) => new Modal()
	.setTitle("Message")
	.setCustomId("message")
	.setComponents(inputRow1(uuid), inputRow2(uuid))
