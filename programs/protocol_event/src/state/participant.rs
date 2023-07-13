use crate::state::type_size::{
    vec_size, BOOL_SIZE, CHAR_SIZE, DISCRIMINATOR_SIZE, ENUM_SIZE, PUB_KEY_SIZE, U16_SIZE,
};
use anchor_lang::prelude::*;

#[account]
pub struct Participant {
    pub authority: Pubkey,
    pub category: Pubkey,
    pub participant_type: ParticipantType,
    pub active: bool,

    pub name: String,
    pub code: String,
    pub id: u16,

    pub payer: Pubkey,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq, Eq)]
pub enum ParticipantType {
    Individual,
    Team,
}

impl Participant {
    pub const MAX_CODE_LENGTH: usize = 8;
    pub const MAX_NAME_LENGTH: usize = 50;

    pub const SIZE: usize = DISCRIMINATOR_SIZE
        + BOOL_SIZE
        + PUB_KEY_SIZE * 3
        + ENUM_SIZE
        + vec_size(CHAR_SIZE, Participant::MAX_NAME_LENGTH)
        + vec_size(CHAR_SIZE, Participant::MAX_CODE_LENGTH)
        + U16_SIZE;
}
