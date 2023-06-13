use anchor_lang::prelude::*;
use crate::CreateEvent;
use crate::state::event_account::{EventStatus, EventType, OracleReference};

pub fn create(
    ctx: Context<CreateEvent>,
    slug: String,
    name: String,
    event_type: EventType,
    start_expected_timestamp: i64,
    participants: Vec<String>,
    oracle: String,
    oracle_reference: String,
) -> Result<()> {
    ctx.accounts.event.authority = ctx.accounts.authority.key();
    ctx.accounts.event.slug = slug;
    ctx.accounts.event.name = name;
    ctx.accounts.event.event_type = event_type;
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
