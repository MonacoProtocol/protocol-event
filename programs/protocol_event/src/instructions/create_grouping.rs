use crate::context::{CreateCategory, CreateEventGroup};
use anchor_lang::prelude::*;

pub fn create_category(ctx: Context<CreateCategory>, code: String, name: String) -> Result<()> {
    let category = &mut ctx.accounts.category;

    category.payer = ctx.accounts.payer.key();
    category.code = code;
    category.name = name;
    category.participant_count = 0;

    Ok(())
}

pub fn create_event_group(
    ctx: Context<CreateEventGroup>,
    code: String,
    name: String,
) -> Result<()> {
    let event_group = &mut ctx.accounts.event_group;

    event_group.category = ctx.accounts.category.key();
    event_group.payer = ctx.accounts.payer.key();
    event_group.code = code;
    event_group.name = name;

    Ok(())
}
