use anchor_lang::prelude::*;

use crate::context::*;
use crate::instructions::CreateEventInfo;
use crate::state::event::*;

pub mod context;
pub mod error;
pub mod instructions;
pub mod state;

declare_id!("mpeq1VkcGKDWS7ELiQJ2diRPX9vHQb27FruqcoxhPqF");

#[program]
pub mod protocol_event {
    use super::*;

    // Event management instructions

    pub fn create_event(ctx: Context<CreateEvent>, event_info: CreateEventInfo) -> Result<()> {
        instructions::create(
            &mut ctx.accounts.event,
            event_info,
            ctx.accounts.authority.key(),
            ctx.accounts.authority.key(),
            ctx.accounts.category.key(),
            ctx.accounts.category.participant_count,
            ctx.accounts.event_group.key(),
        )?;
        Ok(())
    }

    pub fn activate_event(ctx: Context<UpdateEvent>, _code: String) -> Result<()> {
        instructions::update_event::update_active_flag(&mut ctx.accounts.event, true)
    }

    pub fn deactivate_event(ctx: Context<UpdateEvent>, _code: String) -> Result<()> {
        instructions::update_event::update_active_flag(&mut ctx.accounts.event, false)
    }

    pub fn add_event_participants(
        ctx: Context<UpdateEvent>,
        _code: String,
        participants_to_add: Vec<u16>,
    ) -> Result<()> {
        instructions::update_event::add_participants(
            &mut ctx.accounts.event.participants,
            participants_to_add,
            ctx.accounts.category.participant_count,
        )
    }

    pub fn remove_event_participants(
        ctx: Context<UpdateEvent>,
        _code: String,
        participants_to_remove: Vec<u16>,
    ) -> Result<()> {
        instructions::update_event::remove_participants(
            &mut ctx.accounts.event.participants,
            participants_to_remove,
        )
    }

    pub fn update_event_expected_start_timestamp(
        ctx: Context<UpdateEvent>,
        _code: String,
        updated_timestamp: i64,
    ) -> Result<()> {
        instructions::update_event::update_expected_start_timestamp(
            &mut ctx.accounts.event,
            updated_timestamp,
        )
    }

    pub fn update_event_actual_start_timestamp(
        ctx: Context<UpdateEvent>,
        _code: String,
        updated_timestamp: i64,
    ) -> Result<()> {
        instructions::update_event::update_actual_start_timestamp(
            &mut ctx.accounts.event,
            updated_timestamp,
        )
    }

    pub fn update_event_actual_end_timestamp(
        ctx: Context<UpdateEvent>,
        _code: String,
        updated_timestamp: i64,
    ) -> Result<()> {
        instructions::update_event::update_actual_end_timestamp(
            &mut ctx.accounts.event,
            updated_timestamp,
        )
    }

    pub fn update_event_name(
        ctx: Context<UpdateEvent>,
        _code: String,
        updated_name: String,
    ) -> Result<()> {
        instructions::update_event::update_name(&mut ctx.accounts.event, updated_name)
    }

    // Grouping management instructions

    pub fn create_category(ctx: Context<CreateCategory>, code: String, name: String) -> Result<()> {
        instructions::create_grouping::create_category(
            &mut ctx.accounts.category,
            ctx.accounts.payer.key(),
            code,
            name,
        )
    }

    pub fn update_category_name(ctx: Context<UpdateCategory>, updated_name: String) -> Result<()> {
        instructions::update_grouping::update_category_name(
            &mut ctx.accounts.category,
            updated_name,
        )
    }

    pub fn create_event_group(
        ctx: Context<CreateEventGroup>,
        code: String,
        name: String,
    ) -> Result<()> {
        instructions::create_grouping::create_event_group(
            &mut ctx.accounts.event_group,
            ctx.accounts.category.key(),
            ctx.accounts.payer.key(),
            code,
            name,
        )
    }

    pub fn update_event_group_name(
        ctx: Context<UpdateEventGroup>,
        updated_name: String,
    ) -> Result<()> {
        instructions::update_grouping::update_event_group_name(
            &mut ctx.accounts.event_group,
            updated_name,
        )
    }

    // Participant management instructions

    pub fn create_individual_participant(
        ctx: Context<CreateParticipant>,
        code: String,
        name: String,
    ) -> Result<()> {
        instructions::update_grouping::increment_category_participant_count(
            &mut ctx.accounts.category,
        )?;
        instructions::create_participant::create_individual_participant(
            &mut ctx.accounts.participant,
            &ctx.accounts.category.key(),
            &ctx.accounts.authority.key(),
            code,
            name,
            ctx.accounts.category.participant_count,
        )
    }

    pub fn create_team_participant(
        ctx: Context<CreateParticipant>,
        code: String,
        name: String,
    ) -> Result<()> {
        instructions::update_grouping::increment_category_participant_count(
            &mut ctx.accounts.category,
        )?;
        instructions::create_participant::create_team_participant(
            &mut ctx.accounts.participant,
            &ctx.accounts.category.key(),
            &ctx.accounts.authority.key(),
            code,
            name,
            ctx.accounts.category.participant_count,
        )
    }

    pub fn update_participant_name(
        ctx: Context<UpdateParticipant>,
        updated_name: String,
    ) -> Result<()> {
        instructions::update_participant::update_name(&mut ctx.accounts.participant, updated_name)
    }

    pub fn update_participant_code(
        ctx: Context<UpdateParticipant>,
        updated_code: String,
    ) -> Result<()> {
        instructions::update_participant::update_code(&mut ctx.accounts.participant, updated_code)
    }

    pub fn activate_participant(ctx: Context<UpdateParticipant>) -> Result<()> {
        instructions::update_participant::activate_participant(&mut ctx.accounts.participant)
    }

    pub fn deactivate_participant(ctx: Context<UpdateParticipant>) -> Result<()> {
        instructions::update_participant::deactivate_participant(&mut ctx.accounts.participant)
    }

    // close accounts

    pub fn close_event(_ctx: Context<CloseEvent>) -> Result<()> {
        Ok(())
    }

    pub fn close_event_group(_ctx: Context<CloseEventGroup>) -> Result<()> {
        Ok(())
    }

    pub fn close_category(_ctx: Context<CloseCategory>) -> Result<()> {
        Ok(())
    }

    pub fn close_participant(_ctx: Context<CloseParticipant>) -> Result<()> {
        Ok(())
    }
}
