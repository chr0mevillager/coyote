import { client } from "./client";

/** Set the activity of the bot. Activity types support "help" */
export default function setBotActivity(activyType: string) {
	if (activyType == "help") {
		client.user.setActivity('/help', { type: 'LISTENING' });
		setInterval(setBotActivity, 1200000, "help");
	}
}