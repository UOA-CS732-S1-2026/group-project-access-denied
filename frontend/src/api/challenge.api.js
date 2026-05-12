import api from './api';

export const getChallenges = ()                    => api.get('/challenges');
export const submitFlag    = (data)                => api.post('/flags/submit', data);
export const useHint       = (challengeId, hintIdx) => api.post(`/challenges/${challengeId}/hint/${hintIdx}`);
