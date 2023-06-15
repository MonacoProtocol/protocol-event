use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use crate::Event;
use crate::instructions::CreateEventInfo;

#[derive(Accounts)]
#[instruction(event_info: CreateEventInfo)]
pub struct CreateEvent<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [event_info.slug.as_ref()],
        bump,
        space = Event::SIZE
    )]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(_slug: String)]
pub struct UpdateEvent<'info> {
    #[account(
        mut,
        seeds = [
            _slug.as_ref()
        ],
        bump,
        has_one = authority,
    )]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub authority: Signer<'info>
}
