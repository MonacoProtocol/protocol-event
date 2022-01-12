use crate::event_account::EventLifeCycleStatus;
use crate::{ProcessEventEnd, ProcessEventStarted};
use anchor_lang::prelude::*;

use solana_program::clock::UnixTimestamp;

pub fn process_event_started(ctx: Context<ProcessEventStarted>) -> ProgramResult {
    let event = &mut ctx.accounts.external_event;

    event.score_home = 0;
    event.score_away = 0;
    event.lifecycle_status = EventLifeCycleStatus::Started;
    event.start_actual_timestamp = UnixTimestamp::default();

    Ok(())
}

pub fn process_event_completed(
    ctx: Context<ProcessEventEnd>,
    score_home: u16,
    score_away: u16,
) -> ProgramResult {
    let event = &mut ctx.accounts.external_event;

    event.score_home = score_home;
    event.score_away = score_away;
    event.lifecycle_status = EventLifeCycleStatus::Completed;
    event.end_actual_timestamp = UnixTimestamp::default();

    Ok(())
}
