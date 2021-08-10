import { derived } from 'svelte/store';
import lines from './lineStore';
import { START_LEVEL, NEW_LEVEL_EVERY } from '../helpers/constants';

export const level = derived(lines, $lines => Math.max(START_LEVEL, Math.floor($lines / NEW_LEVEL_EVERY)));