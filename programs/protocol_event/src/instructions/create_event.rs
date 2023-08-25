use crate::error::EventError;
use crate::state::event::Event;
use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub struct CreateEventInfo {
    pub code: String,
    pub name: String,
    pub expected_start_timestamp: i64,
    pub actual_start_timestamp: Option<i64>,
    pub actual_end_timestamp: Option<i64>,
}

pub fn create(
    event: &mut Event,
    event_info: CreateEventInfo,
    authority: Pubkey,
    payer: Pubkey,
    subcategory: Pubkey,
    event_group: Pubkey,
) -> Result<()> {
    validate_event(&event_info)?;

    event.authority = authority;
    event.payer = payer;

    event.subcategory = subcategory;
    event.event_group = event_group;

    event.active = false;

    event.code = event_info.code;
    event.name = event_info.name;

    event.participants = vec![];

    event.expected_start_timestamp = event_info.expected_start_timestamp;
    event.actual_start_timestamp = event_info.actual_start_timestamp;
    event.actual_end_timestamp = event_info.actual_end_timestamp;

    Ok(())
}

fn validate_event(event_info: &CreateEventInfo) -> Result<()> {
    require!(
        event_info.name.len() <= Event::MAX_NAME_LENGTH,
        EventError::MaxStringLengthExceeded,
    );
    require!(
        event_info.code.len() <= Event::MAX_CODE_LENGTH,
        EventError::MaxStringLengthExceeded,
    );

    validate_event_timestamps(
        event_info.expected_start_timestamp,
        event_info.actual_start_timestamp,
        event_info.actual_end_timestamp,
    )?;

    Ok(())
}

pub fn validate_event_timestamps(
    expected_start_timestamp: i64,
    actual_start_timestamp: Option<i64>,
    actual_end_timestamp: Option<i64>,
) -> Result<()> {
    if let Some(actual_end_timestamp) = actual_end_timestamp {
        require!(
            expected_start_timestamp <= actual_end_timestamp,
            EventError::InvalidTimestamp
        );
        if let Some(actual_start_timestamp) = actual_start_timestamp {
            require!(
                actual_start_timestamp <= actual_end_timestamp,
                EventError::InvalidTimestamp
            );
        }
    }
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
        };

        let event_info = CreateEventInfo {
            code: "LAFCvLAG@2021-08-28".to_string(),
            name: "Los Angeles Football Club vs. LA Galaxy".to_string(),
            expected_start_timestamp: 1630156800,
            actual_start_timestamp: None,
            actual_end_timestamp: None,
        };

        let authority = Pubkey::new_unique();
        let subcategory = Pubkey::new_unique();
        let event_group = Pubkey::new_unique();

        let result = create(
            &mut new_event,
            event_info,
            authority,
            authority,
            subcategory,
            event_group,
        );

        assert!(result.is_ok());
        assert_eq!(new_event.subcategory, subcategory);
        assert_eq!(new_event.event_group, event_group);
        assert_eq!(new_event.active, false);
        assert_eq!(new_event.authority, authority);
        assert_eq!(new_event.payer, authority);
        assert_eq!(new_event.code, "LAFCvLAG@2021-08-28".to_string());
        assert_eq!(
            new_event.name,
            "Los Angeles Football Club vs. LA Galaxy".to_string()
        );
        assert_eq!(new_event.participants, vec![]);
        assert_eq!(new_event.expected_start_timestamp, 1630156800);
        assert_eq!(new_event.actual_start_timestamp, None);
        assert_eq!(new_event.actual_end_timestamp, None);
    }

    #[test]
    fn test_validate_event_name_length_exceeds_limit() {
        let event_info = CreateEventInfo {
            code: "LAFCvLAG@2021-08-28".to_string(),
            name: "012345678901234567890123456789012345678901234567890".to_string(),
            expected_start_timestamp: 1630156800,
            actual_start_timestamp: None,
            actual_end_timestamp: None,
        };

        let result = validate_event(&event_info);

        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    #[test]
    fn test_validate_event_code_length_exceeds_limit() {
        let event_info = CreateEventInfo {
            code: "012345678901234567890123456789".to_string(),
            name: "Los Angeles Football Club vs. LA Galaxy".to_string(),
            expected_start_timestamp: 1630156800,
            actual_start_timestamp: None,
            actual_end_timestamp: None,
        };

        let result = validate_event(&event_info);

        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    #[test]
    fn test_validate_event_expected_start_after_actual_end() {
        let event_info = CreateEventInfo {
            code: "LAFCvLAG@2021-08-28".to_string(),
            name: "Los Angeles Football Club vs. LA Galaxy".to_string(),
            expected_start_timestamp: 1630156801,
            actual_start_timestamp: None,
            actual_end_timestamp: Some(1630156800),
        };

        let result = validate_event(&event_info);

        assert_eq!(result, Err(error!(EventError::InvalidTimestamp)));
    }

    #[test]
    fn test_validate_event_actual_start_after_actual_end() {
        let event_info = CreateEventInfo {
            code: "LAFCvLAG@2021-08-28".to_string(),
            name: "Los Angeles Football Club vs. LA Galaxy".to_string(),
            expected_start_timestamp: 1630156801,
            actual_start_timestamp: Some(1630156806),
            actual_end_timestamp: Some(1630156805),
        };

        let result = validate_event(&event_info);

        assert_eq!(result, Err(error!(EventError::InvalidTimestamp)));
    }
}
