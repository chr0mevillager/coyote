/**Updates the message and optionally sets a bool to be true*/
export default async function sendUpdate(i) {
	try {
		await i.deferUpdate();
	} catch { }
}