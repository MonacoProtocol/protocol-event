
use crate::event_account::{EventPeriod, EventLifeCycle};
use crate::{ProcessExternalEventUpdate};
use anchor_lang::prelude::*;

use solana_program::clock::UnixTimestamp;

pub fn process_update(
    ctx: Context<ProcessExternalEventUpdate>,
    reference: String,
    participants: String,
    scores: String,
    status: String,
) -> ProgramResult {
    let event = &mut ctx.accounts.external_event;

    // reference must match
    if event.reference != reference {
        return Err(EventError::EventReferenceInvalid.into())
    }

    // TODO: crude way to split up param array
    let participants = participants.replace(&['[', ']'][..], "");
    let _participants_vec: Vec<&str> = participants.split(',').collect();

    let scores = scores.replace(&['[', ']'][..], "");
    let score_vec: Vec<&str> = scores.split(',').collect();

    // TODO: need a better way to break up this string
    // set scores for participants
    // making assumptions about scores array, index 0 is HOME, index 1 is AWAY
    event.score_home = score_vec[0].trim().parse().unwrap();
    event.score_away = score_vec[1].trim().parse().unwrap();

    // set status
    let to_event_period: EventPeriod = convert_to_event_period(status);

    if to_event_period == EventPeriod::Unknown {
        return Err(EventError::EventLifeCycleInvalid.into())
    }

    if event.current_period == EventPeriod::PreEvent {
        event.lifecycle_status = EventLifeCycle::Started;
        event.start_actual_timestamp = UnixTimestamp::default();
    }

    if to_event_period == EventPeriod::FullTime {
        event.lifecycle_status = EventLifeCycle::Completed;
        event.end_actual_timestamp = UnixTimestamp::default();
    }

    validate_period_change(&event.current_period, &to_event_period)?;

    event.current_period = to_event_period;

    Ok(())
}

fn convert_to_event_period(event_period_string: String) -> EventPeriod {

    if event_period_string == "FIRSTHALF" {
        return EventPeriod::FirstHalf;
    }

    if event_period_string == "SECONDHALF" {
        return EventPeriod::SecondHalf;
    }

    if event_period_string == "FULLTIME" {
        return EventPeriod::FullTime;
    }

    return EventPeriod::Unknown;
}

fn validate_period_change (
    from_status: &EventPeriod,
    _to_status: &EventPeriod) -> ProgramResult {

    if from_status == &EventPeriod::PostEvent {
        return Err(EventError::EventPeriodUpdateInvalid.into())
    }

    Ok(())
}

#[error]
pub enum EventError {
    #[msg("Invalid event reference")]
    EventReferenceInvalid,
    #[msg("Invalid lifecycle period")]
    EventLifeCycleInvalid,
    #[msg("Failed to change lifecycle period: attempt to move from -> to an invalid status.")]
    EventLifeCycleUpdateInvalid,
    #[msg("Failed to update period: attempt to move from -> to an invalid status.")]
    EventPeriodUpdateInvalid,
}
