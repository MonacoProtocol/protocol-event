pub mod context;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

use crate::context::*;
use crate::state::event::*;
use crate::instructions::CreateEventInfo;

declare_id!("5qCutonYoeg1aRK31mv4oQYoKdNFMpPaEtDe9nnNQXXf");

#[program]
pub mod protocol_event {
    use super::*;

    pub fn create_event(
        ctx: Context<CreateEvent>,
        event_info: CreateEventInfo,
    ) -> Result<()> {
        instructions::create(ctx, event_info)?;
        Ok(())
    }

    pub fn activate_event(
        ctx: Context<UpdateEvent>,
        _slug: String,
    ) -> Result<()> {
        instructions::update::update_active_flag(ctx, true)
    }

    pub fn deactivate_event(
        ctx: Context<UpdateEvent>,
        _slug: String,
    ) -> Result<()> {
        instructions::update::update_active_flag(ctx, false)
    }

    pub fn update_participants(
        ctx: Context<UpdateEvent>,
        _slug: String,
        participants: Vec<u16>,
    ) -> Result<()> {
        instructions::update::update_participants(ctx, participants)
    }

    pub fn update_expected_start_timestamp(
        ctx: Context<UpdateEvent>,
        _slug: String,
        updated_timestamp: i64,
    ) -> Result<()> {
        instructions::update::updated_expected_start_timestamp(ctx, updated_timestamp)
    }
}

