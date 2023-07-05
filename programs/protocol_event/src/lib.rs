pub mod context;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

use crate::context::*;
use crate::instructions::CreateEventInfo;
use crate::state::event::*;

declare_id!("5qCutonYoeg1aRK31mv4oQYoKdNFMpPaEtDe9nnNQXXf");

#[program]
pub mod protocol_event {
    use super::*;

    pub fn create_event(ctx: Context<CreateEvent>, event_info: CreateEventInfo) -> Result<()> {
        instructions::create(ctx, event_info)?;
        Ok(())
    }

    pub fn activate_event(ctx: Context<UpdateEvent>, _slug: String) -> Result<()> {
        instructions::update_event::update_active_flag(ctx, true)
    }

    pub fn deactivate_event(ctx: Context<UpdateEvent>, _slug: String) -> Result<()> {
        instructions::update_event::update_active_flag(ctx, false)
    }

    pub fn update_participants(
        ctx: Context<UpdateEvent>,
        _slug: String,
        participants: Vec<u16>,
    ) -> Result<()> {
        instructions::update_event::update_participants(ctx, participants)
    }

    pub fn update_expected_start_timestamp(
        ctx: Context<UpdateEvent>,
        _slug: String,
        updated_timestamp: i64,
    ) -> Result<()> {
        instructions::update_event::updated_expected_start_timestamp(ctx, updated_timestamp)
    }

    // Grouping management instructions

    pub fn create_category(ctx: Context<CreateCategory>, code: String, name: String) -> Result<()> {
        instructions::create_grouping::create_category(ctx, code, name)
    }

    pub fn create_event_group(
        ctx: Context<CreateEventGroup>,
        code: String,
        name: String,
    ) -> Result<()> {
        instructions::create_grouping::create_event_group(ctx, code, name)
    }
}
