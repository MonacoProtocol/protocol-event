use crate::error::EventError;
use crate::state::participant::Participant;
use anchor_lang::prelude::*;

pub fn update_code(participant: &mut Participant, code: String) -> Result<()> {
    require!(
        code.len() <= Participant::MAX_CODE_LENGTH,
        EventError::MaxStringLengthExceeded,
    );

    participant.code = code;
    Ok(())
}

pub fn update_name(participant: &mut Participant, name: String) -> Result<()> {
    require!(
        name.len() <= Participant::MAX_NAME_LENGTH,
        EventError::MaxStringLengthExceeded,
    );

    participant.name = name;
    Ok(())
}

pub fn activate_participant(participant: &mut Participant) -> Result<()> {
    participant.active = true;
    Ok(())
}

pub fn deactivate_participant(participant: &mut Participant) -> Result<()> {
    participant.active = false;
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::state::participant::ParticipantType;

    #[test]
    fn test_update_code() {
        let mut participant = &mut participant();
        let result = update_code(&mut participant, "new code".to_string());
        assert!(result.is_ok());
        assert_eq!(participant.code, "new code".to_string());
    }

    #[test]
    fn test_update_code_code_exceeds_limit() {
        let result = update_code(&mut participant(), "012345678".to_string());
        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    #[test]
    fn test_update_name() {
        let mut participant = &mut participant();
        let result = update_name(&mut participant, "new name".to_string());
        assert!(result.is_ok());
        assert_eq!(participant.name, "new name".to_string());
    }

    #[test]
    fn test_update_name_name_exceeds_limit() {
        let result = update_name(
            &mut participant(),
            "012345678901234567890123456789012345678901234567890".to_string(),
        );
        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    #[test]
    fn test_deactivate_activate_participant() {
        let mut participant = &mut participant();
        assert_eq!(participant.active, true);

        let result = deactivate_participant(&mut participant);
        assert!(result.is_ok());
        assert_eq!(participant.active, false);

        let result = activate_participant(&mut participant);
        assert!(result.is_ok());
        assert_eq!(participant.active, true);
    }

    fn participant() -> Participant {
        Participant {
            code: "code".to_string(),
            name: "name".to_string(),
            id: 1,
            participant_type: ParticipantType::Team,
            subcategory: Pubkey::new_from_array([0; 32]),
            payer: Pubkey::new_from_array([0; 32]),
            authority: Default::default(),
            active: true,
        }
    }
}
