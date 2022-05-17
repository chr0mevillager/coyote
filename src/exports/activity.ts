import { client } from "./client";

let activityRotation;
let activityIndex;
/** Set the activity of the bot. Activity types support "help" */
export function setBotActivity() {
	if (!activityRotation) return;

	if (activityIndex == 0) client.user.setActivity('online!\u2800\u2800\u2800\u2800\u2800\u2800\u2800🔼', { type: 'STREAMING' });
	if (activityIndex == 1) client.user.setActivity('/help \u2800\u2800\u2800\u2800\u2800❔', { type: 'LISTENING' });
	if (activityIndex == 2) client.user.setActivity('polls\u2800\u2800\u2800\u2800\u2800\u2800\u2800📊', { type: 'WATCHING' });
	if (activityIndex == 3) client.user.setActivity('messages \u2800\u2800\u2800📨', { type: 'WATCHING' });

	activityIndex++;
	if (activityIndex > 3) activityIndex = 1;

	if (activityIndex = 0) {
		setInterval(setBotActivity, 300000, activityIndex);
	} else {
		setInterval(setBotActivity, 600000, activityIndex);
	}
}

export function setRotateStatus(rotate: boolean) {
	activityRotation = rotate;
}

export function setNextStatus(index: number) {
	activityIndex = index;
}