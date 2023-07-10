use crate::error::EventError;
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

pub fn update_expected_start_timestamp(event: &mut Event, timestamp: i64) -> Result<()> {
    event.expected_start_timestamp = timestamp;
    Ok(())
}

pub fn update_actual_start_timestamp(event: &mut Event, timestamp: i64) -> Result<()> {
    event.actual_start_timestamp = Some(timestamp);
    Ok(())
}

pub fn update_actual_end_timestamp(event: &mut Event, timestamp: i64) -> Result<()> {
    event.actual_end_timestamp = Some(timestamp);
    Ok(())
}

pub fn update_name(event: &mut Event, name: String) -> Result<()> {
    require!(
        name.len() <= Event::MAX_NAME_LENGTH,
        EventError::MaxStringLengthExceeded,
    );

    event.name = name;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_update_active_flag() {
        let mut event = event();

        assert!(update_active_flag(&mut event, true).is_ok());
        assert_eq!(event.active, true);
    }

    #[test]
    fn test_update_expected_start() {
        let mut event = event();

        assert!(update_expected_start_timestamp(&mut event, 1).is_ok());
        assert_eq!(event.expected_start_timestamp, 1);
    }

    #[test]
    fn test_update_actual_start() {
        let mut event = event();

        assert!(update_actual_start_timestamp(&mut event, 1).is_ok());
        assert_eq!(event.actual_start_timestamp, Some(1));
    }

    #[test]
    fn test_update_actual_end() {
        let mut event = event();

        assert!(update_actual_end_timestamp(&mut event, 1).is_ok());
        assert_eq!(event.actual_end_timestamp, Some(1));
    }

    #[test]
    fn test_update_name() {
        let mut event = event();
        let updated_name = "Name Is Updated".to_string();

        assert!(update_name(&mut event, updated_name.clone()).is_ok());
        assert_eq!(event.name, updated_name);
    }

    #[test]
    fn test_update_name_exceeds_limit() {
        let mut event = event();
        let result = update_name(
            &mut event,
            "012345678901234567890123456789012345678901234567890".to_string(),
        );

        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    fn event() -> Event {
        Event {
            category: Default::default(),
            event_group: Default::default(),
            active: false,
            authority: Default::default(),
            payer: Default::default(),
            slug: "".to_string(),
            name: "".to_string(),
            participants: vec![],
            expected_start_timestamp: 0,
            actual_start_timestamp: None,
            actual_end_timestamp: None,
        }
    }
}
