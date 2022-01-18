mod event_account;

use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

use std::mem::size_of;

use crate::event_account::ExternalEvent;

pub mod instructions;

declare_id!("9JLmsTwUk1LTB2MaxouABY5hrSLdFEuZBxZ5oUXCnVH1");

#[program]
pub mod externalevent {
    use super::*;

    pub fn create_external_event(
        ctx: Context<CreateEvent>,
        name: String,
        reference: String,
        start_timestamp: i64,
        team_name_home: String,
        team_name_away: String,
    ) -> ProgramResult {
        msg!("Creating external event...");

        instructions::create(ctx, name, reference, start_timestamp, team_name_home, team_name_away)?;

        msg!("Created external event.");
        Ok(())
    }

    pub fn process_update(
        ctx: Context<ProcessExternalEventUpdate>,
        reference: String,
        participants: String,
        scores: String,
        status: String,
    ) -> ProgramResult {
        msg!("Processing event update...");

        instructions::process_update(ctx, reference, participants, scores, status)?;

        msg!("Processed event update.");
        Ok(())
    }

}

#[derive(Accounts)]
pub struct CreateEvent<'info> {
    #[account(init, payer = authority, space = 8 + size_of::< ExternalEvent > ())]
    pub external_event: Account<'info, ExternalEvent>,
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ProcessExternalEventUpdate<'info> {
    #[account(mut, has_one = authority)]
    pub external_event: Account<'info, ExternalEvent>,
    pub authority: Signer<'info>,
}
