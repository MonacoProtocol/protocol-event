use anchor_lang::prelude::*;

use crate::error::EventError;
use crate::state::category::Category;
use crate::state::event_group::EventGroup;
use crate::state::subcategory::Subcategory;

pub fn increment_category_participant_count(category: &mut Subcategory) -> Result<()> {
    category.participant_count = category.participant_count.checked_add(1).unwrap();

    Ok(())
}

pub fn update_category_name(category: &mut Category, updated_name: String) -> Result<()> {
    require!(
        updated_name.len() <= EventGroup::MAX_NAME_LENGTH,
        EventError::MaxStringLengthExceeded,
    );

    category.name = updated_name;

    Ok(())
}

pub fn update_subcategory_name(category: &mut Subcategory, updated_name: String) -> Result<()> {
    require!(
        updated_name.len() <= EventGroup::MAX_NAME_LENGTH,
        EventError::MaxStringLengthExceeded,
    );

    category.name = updated_name;

    Ok(())
}

pub fn update_event_group_name(event_group: &mut EventGroup, updated_name: String) -> Result<()> {
    require!(
        updated_name.len() <= EventGroup::MAX_NAME_LENGTH,
        EventError::MaxStringLengthExceeded,
    );

    event_group.name = updated_name;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_update_category_name() {
        let mut category = &mut category();
        let result = update_subcategory_name(&mut category, "new name".to_string());
        assert!(result.is_ok());
        assert_eq!(category.name, "new name".to_string());
    }

    #[test]
    fn test_update_category_name_name_exceeds_limit() {
        let result = update_subcategory_name(
            &mut category(),
            "012345678901234567890123456789012345678901234567890".to_string(),
        );
        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    fn category() -> Subcategory {
        Subcategory {
            code: "code".to_string(),
            name: "name".to_string(),
            participant_count: 0,
            authority: Pubkey::new_unique(),
            payer: Pubkey::new_unique(),
            category: Default::default(),
        }
    }

    #[test]
    fn test_update_event_group_name() {
        let event_group = &mut event_group();
        let result = update_event_group_name(event_group, "new name".to_string());
        assert!(result.is_ok());
        assert_eq!(event_group.name, "new name".to_string());
    }

    #[test]
    fn test_update_event_group_name_name_exceeds_limit() {
        let result = update_event_group_name(
            &mut event_group(),
            "012345678901234567890123456789012345678901234567890".to_string(),
        );
        assert_eq!(result, Err(error!(EventError::MaxStringLengthExceeded)));
    }

    fn event_group() -> EventGroup {
        EventGroup {
            subcategory: Default::default(),
            code: "code".to_string(),
            name: "name".to_string(),
            authority: Pubkey::new_unique(),
            payer: Pubkey::new_unique(),
        }
    }
}
