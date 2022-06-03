use crate::event_account::{EventPeriod, EventStatus, EventLifeCycle};
use crate::CreateEvent;
use anchor_lang::prelude::*;

pub fn create(
    ctx: Context<CreateEvent>,
    name: String,
    reference: String,
    start_timestamp: i64,
    team_name_home: String,
    team_name_away: String,
) -> Result<()> {
    ctx.accounts.external_event.authority = ctx.accounts.authority.key();
    ctx.accounts.external_event.status = EventStatus::InActive;
    ctx.accounts.external_event.name = name;
    ctx.accounts.external_event.reference = reference;
    ctx.accounts.external_event.lifecycle_status = EventLifeCycle::Upcoming;
    ctx.accounts.external_event.current_period = EventPeriod::PreEvent;
    ctx.accounts.external_event.start_expected_timestamp = start_timestamp;
    ctx.accounts.external_event.team_home = team_name_home;
    ctx.accounts.external_event.team_away = team_name_away;

    Ok(())
}
