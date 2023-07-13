use crate::state::type_size::{vec_size, CHAR_SIZE, PUB_KEY_SIZE, U16_SIZE};
use anchor_lang::prelude::*;

#[account]
pub struct Category {
    pub authority: Pubkey,
    pub code: String,
    pub name: String,
    pub participant_count: u16, // current number of Participant accounts created for Category
    pub payer: Pubkey,
}

impl Category {
    pub const MAX_CODE_LENGTH: usize = 8;
    pub const MAX_NAME_LENGTH: usize = 50;

    pub const SIZE: usize = PUB_KEY_SIZE * 2
        + vec_size(CHAR_SIZE, Category::MAX_CODE_LENGTH)
        + vec_size(CHAR_SIZE, Category::MAX_NAME_LENGTH)
        + U16_SIZE;
}
