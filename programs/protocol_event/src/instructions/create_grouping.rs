use crate::error::EventError;
use crate::state::category::Category;
use crate::state::event_group::EventGroup;
use anchor_lang::prelude::*;

pub fn create_category(
    category: &mut Category,
    payer: Pubkey,
    code: String,
    name: String,
) -> Result<()> {
    validate_category(&code, &name)?;

    category.payer = payer;
    category.code = code;
    category.name = name;
    category.participant_count = 0;

    Ok(())
}

fn validate_category(code: &String, name: &String) -> Result<()> {
    require!(
        code.len() <= Category::MAX_CODE_LENGTH,
        EventError::MaxStringLengthExceeded,
    );
    require!(
        name.len() <= Category::MAX_NAME_LENGTH,
        EventError::MaxStringLengthExceeded,
    );
    Ok(())
}

pub fn create_event_group(
    event_group: &mut EventGroup,
    category: Pubkey,
    payer: Pubkey,
    code: String,
    name: String,
) -> Result<()> {
    validate_event_group(&code, &name)?;

    event_group.category = category;
    event_group.payer = payer;
    event_group.code = code;
    event_group.name = name;

    Ok(())
}

fn validate_event_group(code: &String, name: &String) -> Result<()> {
    require!(
        code.len() <= EventGroup::MAX_CODE_LENGTH,
        EventError::MaxStringLengthExceeded,
    );
    require!(
        name.len() <= EventGroup::MAX_NAME_LENGTH,
        EventError::MaxStringLengthExceeded,
    );
    Ok(())
}

#[cfg(test)]
mod tests {
    use crate::error::EventError;
    use crate::instructions::create_grouping::{validate_category, validate_event_group};
    use crate::instructions::{create_category, create_event_group};
    use crate::state::category::Category;
    use crate::state::event_group::EventGroup;
    use anchor_lang::error;
    use solana_program::pubkey::Pubkey;

    #[test]
    fn test_create_category() {
        let mut new_category = Category {
            code: "".to_string(),
            name: "".to_string(),
            participant_count: 0,
            payer: Default::default(),
        };

        let code = "FOOTBALL".to_string();
        let name = "Football".to_string();
        let payer = Pubkey::new_unique();

        let result = create_category(&mut new_category, payer, code.clone(), name.clone());

        assert!(result.is_ok());
        assert_eq!(new_category.payer, payer);
        assert_eq!(new_category.code, code);
        assert_eq!(new_category.name, name);
        assert_eq!(new_category.participant_count, 0);
    }

    #[test]
    fn test_validate_category_code_exceeds_limit() {
        let result = validate_category(&"012345678".to_string(), &"Football".to_string());

        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    #[test]
    fn test_validate_category_name_exceeds_limit() {
        let result = validate_category(
            &"FOOTBALL".to_string(),
            &"012345678901234567890123456789012345678901234567890".to_string(),
        );

        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    #[test]
    fn test_create_event_group() {
        let mut new_event_group = EventGroup {
            category: Default::default(),
            code: "".to_string(),
            name: "".to_string(),
            payer: Default::default(),
        };

        let code = "MLS".to_string();
        let name = "Major League Soccer".to_string();
        let category = Pubkey::new_unique();
        let payer = Pubkey::new_unique();

        let result = create_event_group(
            &mut new_event_group,
            category,
            payer,
            code.clone(),
            name.clone(),
        );

        assert!(result.is_ok());
        assert_eq!(new_event_group.category, category);
        assert_eq!(new_event_group.payer, payer);
        assert_eq!(new_event_group.code, code);
        assert_eq!(new_event_group.name, name);
    }

    #[test]
    fn test_create_event_group_code_exceeds_limit() {
        let result =
            validate_event_group(&"012345678".to_string(), &"Major League Soccer".to_string());

        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    #[test]
    fn test_create_event_group_name_exceeds_limit() {
        let result = validate_event_group(
            &"MLS".to_string(),
            &"012345678901234567890123456789012345678901234567890".to_string(),
        );

        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }
}
