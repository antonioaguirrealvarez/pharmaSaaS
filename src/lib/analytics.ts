import mixpanel from 'mixpanel-browser';
import { createModuleLogger } from './logger';

const logger = createModuleLogger('analytics');
const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

// Initialize Mixpanel
if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: import.meta.env.DEV,
    track_pageview: true,
  });
} else {
  logger.warn('Mixpanel token not found. Analytics will be disabled.');
}

export const analytics = {
  identify: (userId: string, traits?: Record<string, any>) => {
    try {
      if (MIXPANEL_TOKEN) {
        mixpanel.identify(userId);
        if (traits) {
          mixpanel.people.set(traits);
        }
      }
    } catch (error) {
      logger.error('Failed to identify user', { userId, error });
    }
  },

  track: (event: string, properties?: Record<string, any>) => {
    try {
      if (MIXPANEL_TOKEN) {
        mixpanel.track(event, properties);
      }
    } catch (error) {
      logger.error('Failed to track event', { event, properties, error });
    }
  },

  page: (pageName: string, properties?: Record<string, any>) => {
    try {
      if (MIXPANEL_TOKEN) {
        mixpanel.track('Page View', {
          page: pageName,
          ...properties,
        });
      }
    } catch (error) {
      logger.error('Failed to track page view', { pageName, properties, error });
    }
  },

  reset: () => {
    try {
      if (MIXPANEL_TOKEN) {
        mixpanel.reset();
      }
    } catch (error) {
      logger.error('Failed to reset analytics', { error });
    }
  },
};