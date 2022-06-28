import { announcementMessage } from "./types";

export let announcement: announcementMessage = {
	title: "There are no Current Announcements",
	description: "```Check back later for new updates, polls, and more.```"
};

export function resetAnnouncement() {
	announcement = {
		title: "There are no Current Announcements",
		description: "```Check back later for new updates, polls, and more.```"
	};
}

export function updateAnnouncement(titleMessage: string, descriptionMessage: string, buttonTitle?: string, buttonLink?: string) {
	if (!buttonTitle) {
		announcement = {
			title: titleMessage,
			description: descriptionMessage,
		};
	} else {
		announcement = {
			title: titleMessage,
			description: descriptionMessage,
			button: {
				title: buttonTitle,
				link: buttonLink,
			},
		};
	}
}