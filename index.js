/**
 * This code needs help.
 */

import { getUserByName, getUserInfractions } from './user-api.js';

/**
 * @param {string} str
 * @returns {string}
 */

function linkifyUrls(str) {
	return str.replace(
	  /\bhttps:\/\/\S+/,
	  (match) => `<a href="${match}">${match}</a>`
	);
  }


/**
 * @param {string} username
 * @param {function(string)} callback
 * @throws {Error}
 */
async function getReasonForWorstInfractionLinkified(username, callback) {
	try {
		const user = await getUserByName(username);
		const result = await getUserInfractions(user.id);
		if (!result.length) {
			throw new Error(`User ${username} has no infractions`);
		}
		
		let foundIndex = result[0];
		for (let i = 1; i < result.length; i++) {
			if (result[i].points > foundIndex.points) {
				foundIndex = result[i];
			}
		}

		const linkifiedReason = linkifyUrls(foundIndex.reason);
		callback(linkifiedReason);
	} catch (error) {
		throw new Error(`Failed to get worst infraction for user ${username}`);
	}
}

/**
 * @param {string} name
 * @param {function(string)} callback
 * @throws {Error} 
 */
async function getReasonForMostRecentInfractionLinkified(name, callback) {
	try {
		const user = await getUserByName(name);
		const result = await getUserInfractions(user.id);
		if (!result.length) {
			throw new Error(`User ${name} has no infractions`);
		}
		
		let recentIndex = result[0];
		for (let i = 1; i < result.length; i++) {
			if (result[i].points > recentIndex.points) {
				recentIndex = result[i];
			}
		}

		const linkifiedReason = linkifyUrls(recentIndex.reason);
		callback(linkifiedReason);

	} catch (error) {
		throw new Error(`Failed to get most recent infraction for user ${name}`);
	}
}

/**
 * Returns reason of the worst & the most recent user infraction with linkified urls
 * @param {string} username
 * @returns {Promise.<Object>}
 */
export async function getRelevantInfractionReasons(username) {
	try {
		const worst = await new Promise((resolve) => {
			getReasonForWorstInfractionLinkified(username, resolve);
		});

		const mostRecent = await new Promise((resolve) => {
			getReasonForMostRecentInfractionLinkified(username, resolve);
		});
		
		return { worst, mostRecent };
	} catch (error) {
		throw new Error(`Failed to get relevant infraction reasons for user ${username}`);
	}
};