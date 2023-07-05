use crate::state::event::Event;
use anchor_lang::prelude::*;

pub fn update_active_flag(event: &mut Event, active: bool) -> Result<()> {
    event.active = active;
    Ok(())
}

pub fn update_participants(event: &mut Event, participants: Vec<u16>) -> Result<()> {
    event.participants = participants;
    Ok(())
}

pub fn updated_expected_start_timestamp(event: &mut Event, timestamp: i64) -> Result<()> {
    event.expected_start_timestamp = timestamp;
    Ok(())
}
