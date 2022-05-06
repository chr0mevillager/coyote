export default async function sendUpdate(i, updateSent?: boolean) {
	await i.deferUpdate();
	if (updateSent) updateSent = true;
}