import avatarImg from './images/bilo_avatar_main_1789242586832.jpg';
import sportCoachImg from './images/bilo_sport_coach_1789242602132.jpg';
import knowledgeGuideImg from './images/bilo_knowledge_guide_1789242616004.jpg';
import thinkingImg from './images/bilo_thinking_state_1789242629934.jpg';
import limitReachedImg from './images/bilo_limit_reached_1789242643049.jpg';

export const BILO_IMAGES = {
  avatar: avatarImg,
  sportCoach: sportCoachImg,
  knowledgeGuide: knowledgeGuideImg,
  thinking: thinkingImg,
  limitReached: limitReachedImg,
};

export function getBiloImageForMode(
  mode: 'sport' | 'knowledge',
  expression?: string
) {
  if (expression === 'thinking') return BILO_IMAGES.thinking;
  if (expression === 'limit_reached') return BILO_IMAGES.limitReached;
  if (mode === 'sport') return BILO_IMAGES.sportCoach;
  return BILO_IMAGES.knowledgeGuide;
}
