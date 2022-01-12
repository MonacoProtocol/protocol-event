mod event_account;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

use std::mem::size_of;

use crate::event_account::Event;

pub mod instructions;

declare_id!("BSCXoMoxyjS7qgCASMCDbKiq8wsa6n59HLNWWpi1Eykk");

#[program]
pub mod event {
    use super::*;

    pub fn create_event(
        ctx: Context<CreateEvent>,
        name: String,
        start_timestamp: i64,
        team_name_home: String,
        team_name_away: String,
    ) -> ProgramResult {
        msg!("Creating event...");

        instructions::create(ctx, name, start_timestamp, team_name_home, team_name_away)?;

        msg!("Created event.");
        Ok(())
    }

    pub fn process_event_started(ctx: Context<ProcessEventStarted>) -> ProgramResult {
        msg!("Processing external event...");

        instructions::process_event_started(ctx)?;

        msg!("Processed external event.");
        Ok(())
    }

    pub fn process_event_completed(
        ctx: Context<ProcessEventEnd>,
        score_home: u16,
        score_away: u16,
    ) -> ProgramResult {
        msg!("Processing external event end...");

        instructions::process_event_completed(ctx, score_home, score_away)?;

        msg!("Processed external event end.");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateEvent<'info> {
    #[account(init, payer = authority, space = 8 + size_of::< Event > ())]
    pub event: Account<'info, Event>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessEventStarted<'info> {
    #[account(mut, has_one = authority)]
    pub event: Account<'info, Event>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ProcessEventEnd<'info> {
    #[account(mut, has_one = authority)]
    pub event: Account<'info, Event>,
    pub authority: Signer<'info>,
}
