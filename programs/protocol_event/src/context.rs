use crate::error::EventError;
use crate::instructions::CreateEventInfo;
use crate::state::category::Category;
use crate::state::event_group::EventGroup;
use crate::state::participant::Participant;
use crate::Event;
use anchor_lang::prelude::*;
use anchor_lang::solana_program::system_program;

#[derive(Accounts)]
#[instruction(event_info: CreateEventInfo)]
pub struct CreateEvent<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [
            b"event".as_ref(),
            event_info.code.as_ref()
        ],
        bump,
        space = Event::SIZE
    )]
    pub event: Account<'info, Event>,

    #[account(has_one = category)]
    pub event_group: Account<'info, EventGroup>,
    pub category: Account<'info, Category>,

    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(_code: String)]
pub struct UpdateEvent<'info> {
    #[account(
        mut,
        seeds = [
            b"event".as_ref(),
            _code.as_ref()
        ],
        bump,
        has_one = authority,
        has_one = category,
    )]
    pub event: Account<'info, Event>,
    pub category: Account<'info, Category>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(code: String)]
pub struct CreateCategory<'info> {
    #[account(
        init,
        payer = payer,
        seeds = [
            b"category".as_ref(),
            code.as_ref(),
        ],
        bump,
        space = Category::SIZE
    )]
    pub category: Account<'info, Category>,

    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateCategory<'info> {
    #[account(mut, has_one = authority)]
    pub category: Account<'info, Category>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(code: String)]
pub struct CreateEventGroup<'info> {
    #[account(
        init,
        payer = payer,
        seeds = [
            b"event_group".as_ref(),
            category.key().as_ref(),
            code.as_ref(),
        ],
        bump,
        space = EventGroup::SIZE
    )]
    pub event_group: Account<'info, EventGroup>,
    pub category: Account<'info, Category>,

    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateEventGroup<'info> {
    #[account(mut, has_one = authority)]
    pub event_group: Account<'info, EventGroup>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreateParticipant<'info> {
    #[account(
        init,
        payer = authority,
        seeds = [
            b"participant".as_ref(),
            category.key().as_ref(),
            category.participant_count.to_string().as_ref()
        ],
        bump,
        space = Participant::SIZE
    )]
    pub participant: Account<'info, Participant>,
    #[account(
        mut,
        has_one = authority @ EventError::AuthorityMismatch,
    )]
    pub category: Account<'info, Category>,

    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(address = system_program::ID)]
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateParticipant<'info> {
    #[account(mut, has_one = authority)]
    pub participant: Account<'info, Participant>,
    pub authority: Signer<'info>,
}

// close accounts

#[derive(Accounts)]
pub struct CloseEvent<'info> {
    #[account(
        mut,
        has_one = authority,
        has_one = payer,
        close = payer,
    )]
    pub event: Account<'info, Event>,
    pub authority: Signer<'info>,
    #[account(mut)]
    pub payer: SystemAccount<'info>,
}

#[derive(Accounts)]
pub struct CloseCategory<'info> {
    #[account(
        mut,
        has_one = authority,
        has_one = payer,
        close = payer,
    )]
    pub category: Account<'info, Category>,
    pub authority: Signer<'info>,
    #[account(mut)]
    pub payer: SystemAccount<'info>,
}

#[derive(Accounts)]
pub struct CloseEventGroup<'info> {
    #[account(
        mut,
        has_one = authority,
        has_one = payer,
        close = payer,
    )]
    pub event_group: Account<'info, EventGroup>,
    pub authority: Signer<'info>,
    #[account(mut)]
    pub payer: SystemAccount<'info>,
}

#[derive(Accounts)]
pub struct CloseParticipant<'info> {
    #[account(
        mut,
        has_one = authority,
        has_one = payer,
        close = payer,
    )]
    pub participant: Account<'info, Participant>,
    pub authority: Signer<'info>,
    #[account(mut)]
    pub payer: SystemAccount<'info>,
}
