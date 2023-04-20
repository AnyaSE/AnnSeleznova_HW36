/**
 * This code needs help.
 */

import { getUserByName, getUserInfractions } from './user-api.js';

/**
 * @param {string} username
 * @param {function(string)} callback
 * @throws {Error}
 */
function getReasonForWorstInfractionLinkified(username, callback)
{
	getUserByName(username, function (user)
	{
		getUserInfractions(user.id, function (result)
		{
			if(!result.length) {
				throw new Error(`User ${username} has no infractions`);
			}
			// find most recent infraction with most infraction points
			let foundIndex = 0;
			for (let i = 1; i < result.length; i++)
			{
				if (result[i].points > result[foundIndex].points)
				{
					foundIndex = i;
				}
			}

			// replace urls by links
			const foundReason = result[foundIndex].reason.replace(
				/\bhttps:\/\/\S+/,
				match => `<a href="${match}">${match}</a>`
			);
			callback(foundReason);
		}) .catch((error) => {
			throw new Error(`Failed to get infractions for user ${username}`)
		});
	});
}

/**
 * @param {string} name
 * @param {function(string)} callback
 * @throws {Error} 
 */
function getReasonForMostRecentInfractionLinkified(name, callback)
{
	getUserByName(name, function (user)
	{
		getUserInfractions(user.id, function (result)
		{
			if(!result.length) {
				throw new Error (`user ${name} has no infractions`)
			}
			// find most recent infraction
			let recentIndex = 0;
			for (let i = 1; i < result.length; i++)
			{
				if (result[i].id > result[recentIndex].id)
				{
					recentIndex = i;
				}
			}

			// replace urls by links
			const recentReason = result[recentIndex].reason.replace(
				/\bhttps:\/\/\S+/,
				match => `<a href="${match}">${match}</a>`
			);
			callback(recentReason);
		}) .catch((error) => {
			throw new Error(`Failed to get infractions for user ${name}`)
		});
	});
}

/**
 * Returns reason of the worst & the most recent user infraction with linkified urls
 * @param {string} username
 * @returns {Promise.<Object>}
 */
export function getRelevantInfractionReasons(username)
{
	return new Promise(function (resolve)
	{
		getReasonForWorstInfractionLinkified(username, function (worst)
		{
			getReasonForMostRecentInfractionLinkified(username, function (mostRecent)
			{
				resolve({mostRecent, worst});
			});
		});
	});
}
