use crate::state::type_size::{vec_size, CHAR_SIZE, PUB_KEY_SIZE, U16_SIZE};
use anchor_lang::prelude::*;

#[account]
pub struct Subcategory {
    pub authority: Pubkey,
    pub category: Pubkey,
    pub code: String,
    pub name: String,
    pub participant_count: u16, // current number of Participant accounts created for Category
    pub payer: Pubkey,
}

impl Subcategory {
    pub const MAX_CODE_LENGTH: usize = 8;
    pub const MAX_NAME_LENGTH: usize = 50;

    pub const SIZE: usize = PUB_KEY_SIZE * 3
        + vec_size(CHAR_SIZE, Subcategory::MAX_CODE_LENGTH)
        + vec_size(CHAR_SIZE, Subcategory::MAX_NAME_LENGTH)
        + U16_SIZE;
}
