use crate::instructions::CreateEventInfo;
use crate::state::category::Category;
use crate::state::event_group::EventGroup;
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
            event_info.slug.as_ref()
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
#[instruction(_slug: String)]
pub struct UpdateEvent<'info> {
    #[account(
        mut,
        seeds = [
            b"event".as_ref(),
            _slug.as_ref()
        ],
        bump,
        has_one = authority,
    )]
    pub event: Account<'info, Event>,
    #[account(mut)]
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
