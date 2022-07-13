import { announcementMessage } from "./types";

export let announcement: announcementMessage = {
	title: "There are no Current Announcements",
	description: "```Check back later for new updates, polls, and more.```"
};

/**Reset the current announcement */
export function resetAnnouncement() {
	announcement = {
		title: "There are no Current Announcements",
		description: "```Check back later for new updates, polls, and more.```"
	};
}

/**Update the current announcement */
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