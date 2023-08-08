use crate::error::EventError;
use crate::state::participant::{Participant, ParticipantType};
use anchor_lang::prelude::*;

pub fn create_individual_participant(
    participant: &mut Participant,
    category: &Pubkey,
    payer: &Pubkey,
    code: String,
    name: String,
    participant_id: u16,
) -> Result<()> {
    initialize_participant(
        participant,
        category,
        payer,
        code,
        name,
        ParticipantType::Individual,
        participant_id,
    )
}

pub fn create_team_participant(
    participant: &mut Participant,
    category: &Pubkey,
    payer: &Pubkey,
    code: String,
    name: String,
    participant_id: u16,
) -> Result<()> {
    initialize_participant(
        participant,
        category,
        payer,
        code,
        name,
        ParticipantType::Team,
        participant_id,
    )
}

fn initialize_participant(
    participant: &mut Participant,
    category: &Pubkey,
    payer: &Pubkey,
    code: String,
    name: String,
    participant_type: ParticipantType,
    participant_id: u16,
) -> Result<()> {
    validate_participant(&code, &name)?;

    participant.subcategory = *category;
    participant.payer = *payer;
    participant.authority = *payer;

    participant.participant_type = participant_type;
    participant.active = true;
    participant.code = code;
    participant.name = name;
    participant.id = participant_id;

    Ok(())
}

fn validate_participant(code: &String, name: &String) -> Result<()> {
    require!(
        code.len() <= Participant::MAX_CODE_LENGTH,
        EventError::MaxStringLengthExceeded,
    );
    require!(
        name.len() <= Participant::MAX_NAME_LENGTH,
        EventError::MaxStringLengthExceeded,
    );
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_validate_participant() {
        let result = validate_participant(
            &"MUFC".to_string(),
            &"Manchester United Football Club".to_string(),
        );
        assert!(result.is_ok())
    }

    #[test]
    fn test_validate_participant_code_exceeds_limit() {
        let result = validate_participant(
            &"012345678".to_string(),
            &"Manchester United Football Club".to_string(),
        );
        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    #[test]
    fn test_validate_participant_name_exceeds_limit() {
        let result = validate_participant(
            &"MUFC".to_string(),
            &"012345678901234567890123456789012345678901234567890".to_string(),
        );
        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }
}
