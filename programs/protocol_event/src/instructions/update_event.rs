use crate::UpdateEvent;
use anchor_lang::prelude::*;

pub fn update_active_flag(ctx: Context<UpdateEvent>, active: bool) -> Result<()> {
    let event = &mut ctx.accounts.event;
    event.active = active;
    Ok(())
}

pub fn update_participants(ctx: Context<UpdateEvent>, participants: Vec<u16>) -> Result<()> {
    let event = &mut ctx.accounts.event;
    event.participants = participants;
    Ok(())
}

pub fn updated_expected_start_timestamp(ctx: Context<UpdateEvent>, timestamp: i64) -> Result<()> {
    let event = &mut ctx.accounts.event;
    event.expected_start_timestamp = timestamp;
    Ok(())
}
