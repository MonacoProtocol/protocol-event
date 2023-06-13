use anchor_lang::prelude::*;

#[account]
pub struct Event {
    pub authority: Pubkey,
    pub slug: String,
    pub name: String,
    pub event_type: EventType,
    pub participants: Vec<String>,
    pub start_expected_timestamp: i64,
    pub end_actual_timestamp: Option<i64>,

    pub reference: OracleReference,

    pub active: bool,
    pub status: EventStatus,

    pub current_score: Option<String>,
    pub current_period: Option<u16>,
}

impl Event {
    const MAX_PARTICIPANTS: usize = 30;
    const MAX_STRING_LENGTH: usize = 32;

    const DISCRIMINATOR_SIZE: usize = 8;
    const PUB_KEY_SIZE: usize = 32;
    const CHAR_SIZE: usize = 4;
    const VEC_PREFIX_SIZE: usize = 4;
    const ENUM_SIZE: usize = 1;
    const OPTION_SIZE: usize = 1;
    const TIMESTAMP_SIZE: usize = 8;
    const STATUS_ENUM_SIZE: usize = 1;
    const CURRENT_PERIOD_SIZE: usize = 2;
    const MAX_STRING_SIZE: usize = Event::VEC_PREFIX_SIZE + Event::MAX_STRING_LENGTH * Event::CHAR_SIZE;
    const FLAG_BOOL_SIZE: usize = 1;

    pub const SIZE: usize = Event::DISCRIMINATOR_SIZE +
        Event::PUB_KEY_SIZE + // Authority
        Event::MAX_STRING_SIZE + // Slug
        Event::MAX_STRING_SIZE + // Name
        Event::ENUM_SIZE + // EventType
        Event::VEC_PREFIX_SIZE + Event::MAX_PARTICIPANTS * Event::MAX_STRING_SIZE + // Participants
        Event::TIMESTAMP_SIZE + Event::OPTION_SIZE + Event::TIMESTAMP_SIZE + // Timestamps
        OracleReference::SIZE + // Reference
        Event::STATUS_ENUM_SIZE + // Lifecycle Status
        Event::OPTION_SIZE + Event::MAX_STRING_SIZE + // Score
        Event::OPTION_SIZE + Event::CURRENT_PERIOD_SIZE + // Period
        Event::FLAG_BOOL_SIZE; // Active flag
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub struct OracleReference {
    pub oracle: String,
    pub reference: String
}

impl OracleReference {
    const MAX_STRING_LENGTH: usize = 32;

    const DISCRIMINATOR_SIZE: usize = 8;
    const CHAR_SIZE: usize = 4;
    const STRING_PREFIX_SIZE: usize = 4;

    pub const SIZE: usize = OracleReference::DISCRIMINATOR_SIZE +
        OracleReference::STRING_PREFIX_SIZE + OracleReference::MAX_STRING_LENGTH * OracleReference::CHAR_SIZE * 2;
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub enum EventStatus {
    Unknown,
    Upcoming,
    Started,
    Completed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub enum EventType {
    AVB,
}
