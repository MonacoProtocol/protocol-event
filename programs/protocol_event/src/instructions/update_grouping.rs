use anchor_lang::prelude::*;

use crate::state::category::Category;

pub fn increment_category_participant_count(category: &mut Category) -> Result<()> {
    category.participant_count = category.participant_count.checked_add(1).unwrap();

    Ok(())
}
