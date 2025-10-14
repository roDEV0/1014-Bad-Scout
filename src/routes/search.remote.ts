import { query } from '$app/server';
import { error } from '@sveltejs/kit'
import { createTBACaller } from 'tbarequest';
import { TBA_API_KEY } from "$env/static/private";
import { type } from 'arktype';

const caller = createTBACaller(TBA_API_KEY);

export const verifyTeamAndSearch = query(type("string"), async (key) => {
    const team = await caller('/team/{team_key}', key);
    if (!team) error(404, 'Bwah! Not found!');
    return team;

});