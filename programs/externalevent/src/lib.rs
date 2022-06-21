pub mod context;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

use crate::context::*;
use crate::state::event_account::{Event, EventStatus, EventType};

#[cfg(feature = "stable")]
declare_id!("5qCutonYoeg1aRK31mv4oQYoKdNFMpPaEtDe9nnNQXXf");
#[cfg(feature = "dev")]
declare_id!("5qCutonYoeg1aRK31mv4oQYoKdNFMpPaEtDe9nnNQXXf");
#[cfg(not(any(feature = "stable", feature = "dev")))]
declare_id!("5qCutonYoeg1aRK31mv4oQYoKdNFMpPaEtDe9nnNQXXf");

#[program]
pub mod externalevent {
    use super::*;

    pub fn create_event(
        ctx: Context<CreateEvent>,
        slug: String,
        name: String,
        event_type: EventType,
        start_expected_timestamp: i64,
        participants: Vec<String>,
        oracle: String,
        oracle_reference: String,
    ) -> Result<()> {
        instructions::create(ctx, slug, name, event_type, start_expected_timestamp, participants, oracle, oracle_reference)?;
        Ok(())
    }

    pub fn update_score(
        ctx: Context<UpdateEvent>,
        _slug: String,
        score: String,
    ) -> Result<()> {
        instructions::update::update_score(ctx, score)
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

    pub fn update_period(
        ctx: Context<UpdateEvent>,
        _slug: String,
        period: u16,
    ) -> Result<()> {
        instructions::update::update_period(ctx, period)
    }

    pub fn start_event(
        ctx: Context<UpdateEvent>,
        _slug: String,
    ) -> Result<()> {
        instructions::update::update_status(ctx, EventStatus::Started)
    }

    pub fn complete_event(
        ctx: Context<UpdateEvent>,
        _slug: String,
    ) -> Result<()> {
        instructions::update::update_status(ctx, EventStatus::Completed)
    }

    pub fn update_participants(
        ctx: Context<UpdateEvent>,
        _slug: String,
        participants: Vec<String>,
    ) -> Result<()> {
        instructions::update::update_participants(ctx, participants)
    }

    pub fn set_start_timestamp(
        ctx: Context<UpdateEvent>,
        _slug: String,
        updated_timestamp: i64,
    ) -> Result<()> {
        instructions::update::update_start_timestamp(ctx, updated_timestamp)
    }

}
