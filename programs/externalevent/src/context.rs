use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;
use crate::Event;

#[derive(Accounts)]
#[instruction(name: String, start_expected_timestamp: i64)]
pub struct CreateEvent<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [
            name.as_ref(),
            format!("{}", start_expected_timestamp).as_ref()
        ],
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
#[instruction(_name: String, _start_expected_timestamp: i64)]
pub struct UpdateEvent<'info> {
    #[account(
        mut,
        seeds = [
            _name.as_ref(),
            format!("{}", _start_expected_timestamp).as_ref()
        ],
        bump,
        has_one = authority,
    )]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub authority: Signer<'info>
}