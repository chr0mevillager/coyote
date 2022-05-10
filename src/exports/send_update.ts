/**Updates the message and optionally sets a bool to be true*/
export default async function sendUpdate(i, updateSent?: boolean) {
	await i.deferUpdate();
	if (updateSent) updateSent = true;
}