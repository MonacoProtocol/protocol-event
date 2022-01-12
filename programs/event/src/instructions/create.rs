use crate::event_account::{EventLifeCycleStatus, EventStatus};
use crate::CreateEvent;
use anchor_lang::prelude::*;

pub fn create(
    ctx: Context<CreateEvent>,
    name: String,
    start_timestamp: i64,
    team_name_home: String,
    team_name_away: String,
) -> ProgramResult {
    ctx.accounts.event.authority = ctx.accounts.authority.key();
    ctx.accounts.event.status = EventStatus::InActive;
    ctx.accounts.event.lifecycle_status = EventLifeCycleStatus::NotStarted;
    ctx.accounts.event.name = name;
    ctx.accounts.event.start_expected_timestamp = start_timestamp;
    ctx.accounts.event.team_home = team_name_home;
    ctx.accounts.event.team_away = team_name_away;

    Ok(())
}
