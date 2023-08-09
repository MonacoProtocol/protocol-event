use crate::error::EventError;
use crate::state::event::Event;
use anchor_lang::prelude::*;

pub fn update_active_flag(event: &mut Event, active: bool) -> Result<()> {
    event.active = active;
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

pub fn add_participants(
    participants: &mut Vec<u16>,
    participants_to_add: Vec<u16>,
    subcategory_participant_count: u16,
) -> Result<()> {
    if participants_to_add.is_empty() {
        return Ok(());
    }

    require!(
        participants_to_add
            .iter()
            .all(|&participant| participant > 0 && participant <= subcategory_participant_count),
        EventError::InvalidEventParticipants,
    );

    participants.extend(participants_to_add.into_iter());
    participants.sort_by(|a, b| a.partial_cmp(b).unwrap());
    participants.dedup();

    require!(
        participants.len() <= Event::MAX_PARTICIPANTS,
        EventError::MaxParticipantsExceeded
    );

    Ok(())
}

pub fn remove_participants(
    participants: &mut Vec<u16>,
    participants_to_remove: Vec<u16>,
) -> Result<()> {
    if participants_to_remove.is_empty() || participants.is_empty() {
        return Ok(());
    }

    participants.retain(|participant| !participants_to_remove.contains(participant));

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::error::EventError;
    use crate::state::event::Event;
    use anchor_lang::error;

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

    // add participants

    #[test]
    fn test_add_participants() {
        let existing_participants = &mut vec![1, 2, 3, 4];
        let participants_to_add = vec![5, 6, 7, 8];

        add_participants(existing_participants, participants_to_add, 10).unwrap();

        assert_eq!(existing_participants, &vec![1, 2, 3, 4, 5, 6, 7, 8]);
    }

    #[test]
    fn test_add_participants_empty_vec() {
        let existing_participants = &mut vec![1, 2, 3, 4];
        let participants_to_add = vec![];

        add_participants(existing_participants, participants_to_add, 10).unwrap();

        assert_eq!(existing_participants, &vec![1, 2, 3, 4]);
    }

    #[test]
    fn test_add_participants_dedup() {
        let existing_participants = &mut vec![1, 2, 3, 4, 5];
        let participants_to_add = vec![5, 6, 7, 8];

        add_participants(existing_participants, participants_to_add, 10).unwrap();

        assert_eq!(existing_participants, &vec![1, 2, 3, 4, 5, 6, 7, 8]);
    }

    #[test]
    fn test_add_participants_list_full() {
        let existing_participants: &mut Vec<u16> = &mut vec![];
        for i in 0..Event::MAX_PARTICIPANTS {
            existing_participants.push((i + 1) as u16);
        }

        let participants_to_add = vec![301];

        let result = add_participants(existing_participants, participants_to_add, 500);

        assert_eq!(result, Err(error!(EventError::MaxParticipantsExceeded)));
    }

    #[test]
    fn test_add_participants_invalid_participant() {
        let existing_participants = &mut vec![1, 2, 3, 4, 5];
        let participants_to_add = vec![11];

        let result = add_participants(existing_participants, participants_to_add, 10);

        assert_eq!(result, Err(error!(EventError::InvalidEventParticipants)));
    }

    // remove participants

    #[test]
    fn test_remove_participants() {
        let existing_participants = &mut vec![1, 2, 3, 4];
        let participants_to_remove = vec![1, 2];

        remove_participants(existing_participants, participants_to_remove).unwrap();

        assert_eq!(existing_participants, &vec![3, 4]);
    }

    #[test]
    fn test_remove_participants_empty_vecs() {
        let existing_participants = &mut vec![];
        let participants_to_remove = vec![];

        remove_participants(existing_participants, participants_to_remove).unwrap();

        assert_eq!(existing_participants, &vec![]);
    }

    fn event() -> Event {
        Event {
            subcategory: Default::default(),
            event_group: Default::default(),
            active: false,
            authority: Default::default(),
            payer: Default::default(),
            code: "".to_string(),
            name: "".to_string(),
            participants: vec![],
            expected_start_timestamp: 0,
            actual_start_timestamp: None,
            actual_end_timestamp: None,
        }
    }
}
