import {Link, Store} from '../store/model';
import {Print, logger} from '../logger';
import {WebClient} from '@slack/web-api';
import {config} from '../config';

const slack = config.notifications.slack;
let channel = slack.channel;
const token = slack.token;
const web = new WebClient(token);

export function sendSlackMessage(link: Link, store: Store) {
	if (slack.channel && slack.token) {
		logger.debug('↗ sending slack message');

		if (link.series == '3070') {
			channel = 'tracker-bot-3070'
		} else {
			channel = 'tracker-bot-3080'
		}

		(async () => {
			const givenUrl = link.cartUrl ? link.cartUrl : link.url;

			try {
				const result = await web.chat.postMessage({
					channel,
					text: `${Print.inStock(link, store)}\n${givenUrl}`
				});

				if (!result.ok) {
					logger.error('✖ couldn\'t send slack message', result);
					return;
				}

				logger.info('✔ slack message sent');
			} catch (error) {
				logger.error('✖ couldn\'t send slack message', error);
			}
		})();
	}
}
