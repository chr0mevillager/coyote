/** Returns the current time plus the days, hours, and minutes to the event */
export default function generateTimeStamp(daystoTime: number, hoursToTime: number, minutesToTime: number) {
	if (!daystoTime) daystoTime = 0;
	if (!hoursToTime) hoursToTime = 0;
	if (!minutesToTime) minutesToTime = 0;

	let currentTime = Math.round(new Date().getTime() / 1000);
	let time = currentTime + (daystoTime * 86400) + (hoursToTime * 3600) + (minutesToTime * 60);

	return time;
}