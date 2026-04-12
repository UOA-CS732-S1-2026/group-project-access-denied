import api from './api';

export const getChallenges = ()     => api.get('/challenges');
export const getChallenge  = (id)   => api.get(`/challenges/${id}`);
export const submitFlag    = (data) => api.post('/flags/submit', data);
