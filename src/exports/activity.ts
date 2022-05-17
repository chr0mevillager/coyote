import { client } from "./client";

let activityRotation;
let activityIndex;
/** Set the activity of the bot.*/
export function setBotActivity() {
	if (!activityRotation) return;

	if (activityIndex == 0) client.user.setActivity('\u2800🔼\u2800 my new update!', { type: 'STREAMING' });
	if (activityIndex == 1) client.user.setActivity('\u2800❔\u2800 /help', { type: 'LISTENING' });
	if (activityIndex == 2) client.user.setActivity('\u2800📊\u2800 polls', { type: 'WATCHING' });
	if (activityIndex == 3) client.user.setActivity('\u2800📨\u2800 messages', { type: 'WATCHING' });

	activityIndex++;
	if (activityIndex > 3) activityIndex = 1;

	if (activityIndex == 1) {
		setTimeout(setBotActivity, 300000 /* 15 Seconds for testing 15000*/, activityIndex);
	} else {
		setTimeout(setBotActivity, 600000 /* 30 Seconds for testing 30000*/, activityIndex);
	}
}

export function setRotateStatus(rotate: boolean) {
	activityRotation = rotate;
}

export function setNextStatus(index: number) {
	activityIndex = index;
}