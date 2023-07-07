use crate::error::EventError;
use crate::state::event::Event;
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub struct CreateEventInfo {
    pub slug: String,
    pub name: String,
    pub participants: Vec<u16>,
    pub expected_start_timestamp: i64,
    pub actual_start_timestamp: Option<i64>,
    pub actual_end_timestamp: Option<i64>,
}

pub fn create(
    event: &mut Event,
    event_info: CreateEventInfo,
    authority: Pubkey,
    payer: Pubkey,
    category: Pubkey,
    category_participant_count: u16,
    event_group: Pubkey,
) -> Result<()> {
    validate_event(&event_info, category_participant_count)?;

    event.authority = authority;
    event.payer = payer;

    event.category = category;
    event.event_group = event_group;

    event.active = false;

    event.slug = event_info.slug;
    event.name = event_info.name;

    event.participants = event_info.participants;

    event.expected_start_timestamp = event_info.expected_start_timestamp;
    event.actual_start_timestamp = event_info.actual_start_timestamp;
    event.actual_end_timestamp = event_info.actual_end_timestamp;

    Ok(())
}

fn validate_event(event_info: &CreateEventInfo, category_participant_count: u16) -> Result<()> {
    require!(
        event_info.name.len() <= Event::MAX_NAME_LENGTH,
        EventError::MaxStringLengthExceeded,
    );
    require!(
        event_info.slug.len() <= Event::MAX_SLUG_LENGTH,
        EventError::MaxStringLengthExceeded,
    );
    require!(
        event_info.participants.len() <= Event::MAX_PARTICIPANTS,
        EventError::MaxParticipantsExceeded,
    );
    require!(
        event_info
            .participants
            .iter()
            .all(|&participant| participant > 0 && participant < category_participant_count),
        EventError::InvalidEventParticipants,
    );
    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::error::EventError;
    use crate::instructions::create_event::validate_event;
    use crate::instructions::{create, CreateEventInfo};
    use crate::state::event::Event;
    use anchor_lang::error;
    use solana_program::pubkey::Pubkey;

    #[test]
    fn test_create_event() {
        let mut new_event = Event {
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
        };

        let event_info = CreateEventInfo {
            slug: "LAFCvLAG@2021-08-28".to_string(),
            name: "Los Angeles Football Club vs. LA Galaxy".to_string(),
            participants: vec![1, 2, 3, 4, 5],
            expected_start_timestamp: 1630156800,
            actual_start_timestamp: None,
            actual_end_timestamp: None,
        };

        let authority = Pubkey::new_unique();
        let category = Pubkey::new_unique();
        let event_group = Pubkey::new_unique();

        let result = create(
            &mut new_event,
            event_info,
            authority,
            authority,
            category,
            10,
            event_group,
        );

        assert!(result.is_ok());
        assert_eq!(new_event.category, category);
        assert_eq!(new_event.event_group, event_group);
        assert_eq!(new_event.active, false);
        assert_eq!(new_event.authority, authority);
        assert_eq!(new_event.payer, authority);
        assert_eq!(new_event.slug, "LAFCvLAG@2021-08-28".to_string());
        assert_eq!(
            new_event.name,
            "Los Angeles Football Club vs. LA Galaxy".to_string()
        );
        assert_eq!(new_event.participants, vec![1, 2, 3, 4, 5]);
        assert_eq!(new_event.expected_start_timestamp, 1630156800);
        assert_eq!(new_event.actual_start_timestamp, None);
        assert_eq!(new_event.actual_end_timestamp, None);
    }

    #[test]
    fn test_validate_event_name_length_exceeds_limit() {
        let event_info = CreateEventInfo {
            slug: "LAFCvLAG@2021-08-28".to_string(),
            name: "012345678901234567890123456789012345678901234567890".to_string(),
            participants: vec![],
            expected_start_timestamp: 1630156800,
            actual_start_timestamp: None,
            actual_end_timestamp: None,
        };

        let result = validate_event(&event_info, 10);

        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    #[test]
    fn test_validate_event_slug_length_exceeds_limit() {
        let event_info = CreateEventInfo {
            slug: "012345678901234567890123456789".to_string(),
            name: "Los Angeles Football Club vs. LA Galaxy".to_string(),
            participants: vec![],
            expected_start_timestamp: 1630156800,
            actual_start_timestamp: None,
            actual_end_timestamp: None,
        };

        let result = validate_event(&event_info, 10);

        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    #[test]
    fn test_validate_event_participants_exceeds_limit() {
        let participants: Vec<u16> = (1..=301).map(|num| num as u16).collect();
        let event_info = CreateEventInfo {
            slug: "LAFCvLAG@2021-08-28".to_string(),
            name: "Los Angeles Football Club vs. LA Galaxy".to_string(),
            participants,
            expected_start_timestamp: 1630156800,
            actual_start_timestamp: None,
            actual_end_timestamp: None,
        };

        let result = validate_event(&event_info, 300);

        assert_eq!(result, Err(error!(EventError::MaxParticipantsExceeded)));
    }

    #[test]
    fn test_validate_event_participants_not_in_category() {
        let participants: Vec<u16> = (1..=20).map(|num| num as u16).collect();
        let event_info = CreateEventInfo {
            slug: "LAFCvLAG@2021-08-28".to_string(),
            name: "Los Angeles Football Club vs. LA Galaxy".to_string(),
            participants,
            expected_start_timestamp: 1630156800,
            actual_start_timestamp: None,
            actual_end_timestamp: None,
        };

        let result = validate_event(&event_info, 10);

        assert_eq!(result, Err(error!(EventError::InvalidEventParticipants)));
    }
}
