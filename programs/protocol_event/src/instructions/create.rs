use anchor_lang::prelude::*;
use crate::CreateEvent;
use crate::state::event::{Category, EventGroup};

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub struct CreateEventInfo {
    pub category: Category,
    pub event_group: EventGroup,
    pub slug: String,
    pub name: String,
    pub participants: Vec<u16>,
    pub expected_start_timestamp: i64,
    pub actual_start_timestamp: Option<i64>,
    pub actual_end_timestamp: Option<i64>,
}

pub fn create(
    ctx: Context<CreateEvent>,
    event_info: CreateEventInfo,
) -> Result<()> {
    let event = &mut ctx.accounts.event;

    event.authority = ctx.accounts.authority.key();
    event.payer = ctx.accounts.authority.key();

    event.category = event_info.category;
    event.event_group = event_info.event_group;

    event.active = false;

    event.slug = event_info.slug;
    event.name = event_info.name;

    event.participants = event_info.participants;

    event.expected_start_timestamp = event_info.expected_start_timestamp;
    event.actual_start_timestamp = event_info.actual_start_timestamp;
    event.actual_end_timestamp = event_info.actual_end_timestamp;

    Ok(())
}
