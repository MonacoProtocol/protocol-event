use anchor_lang::prelude::*;
use crate::CreateEvent;
use crate::state::event_account::{EventStatus, OracleReference};

pub fn create(
    ctx: Context<CreateEvent>,
    name: String,
    start_expected_timestamp: i64,
    participants: Vec<String>,
    oracle: String,
    oracle_reference: String,
) -> Result<()> {
    ctx.accounts.event.authority = ctx.accounts.authority.key();
    ctx.accounts.event.name = name;
    ctx.accounts.event.start_expected_timestamp = start_expected_timestamp;
    ctx.accounts.event.end_actual_timestamp = None;
    ctx.accounts.event.participants = participants;
    ctx.accounts.event.reference = OracleReference {
        oracle,
        reference: oracle_reference
    };
    ctx.accounts.event.active = false;
    ctx.accounts.event.status = EventStatus::Upcoming;
    ctx.accounts.event.current_score = None;
    ctx.accounts.event.current_period = None;

    Ok(())
}
