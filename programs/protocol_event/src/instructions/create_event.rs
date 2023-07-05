use crate::CreateEvent;
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub struct CreateEventInfo {
    pub slug: String,
    pub name: String,
    pub participants: Vec<u16>,
    pub expected_start_timestamp: i64,
    pub actual_start_timestamp: Option<i64>,
    pub actual_end_timestamp: Option<i64>,
}

pub fn create(ctx: Context<CreateEvent>, event_info: CreateEventInfo) -> Result<()> {
    let event = &mut ctx.accounts.event;

    event.authority = ctx.accounts.authority.key();
    event.payer = ctx.accounts.authority.key();

    event.category = ctx.accounts.category.key();
    event.event_group = ctx.accounts.event_group.key();

    event.active = false;

    event.slug = event_info.slug;
    event.name = event_info.name;

    event.participants = event_info.participants;

    event.expected_start_timestamp = event_info.expected_start_timestamp;
    event.actual_start_timestamp = event_info.actual_start_timestamp;
    event.actual_end_timestamp = event_info.actual_end_timestamp;

    Ok(())
}
