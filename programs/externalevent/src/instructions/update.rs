use anchor_lang::prelude::*;
use crate::state::event_account::EventStatus;
use crate::UpdateEvent;

pub fn update_score(ctx: Context<UpdateEvent>, score: String) -> Result<()> {
    let event = &mut ctx.accounts.event;
    event.current_score = Option::from(score);
    Ok(())
}

pub fn update_period(ctx: Context<UpdateEvent>, period: u16) -> Result<()> {
    let event = &mut ctx.accounts.event;
    event.current_period = Option::from(period);
    Ok(())
}

pub fn update_status(ctx: Context<UpdateEvent>, status: EventStatus) -> Result<()> {
    let event = &mut ctx.accounts.event;
    event.status = status;
    Ok(())
}

pub fn update_active_flag(ctx: Context<UpdateEvent>, active: bool) -> Result<()> {
    let event = &mut ctx.accounts.event;
    event.active = active;
    Ok(())
}

pub fn update_participants(ctx: Context<UpdateEvent>, participants: Vec<String>) -> Result<()> {
    let event = &mut ctx.accounts.event;
    event.participants = participants;
    Ok(())
}