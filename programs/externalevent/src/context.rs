use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use crate::Event;

#[derive(Accounts)]
#[instruction(slug: String)]
pub struct CreateEvent<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [slug.as_ref()],
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