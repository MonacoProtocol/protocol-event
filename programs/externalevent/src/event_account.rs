use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct ExternalEvent {
    pub authority: Pubkey,
    pub name: String,
    pub start_expected_timestamp: i64,
    pub start_actual_timestamp: i64,
    pub end_actual_timestamp: i64,
    pub status: EventStatus,
    pub lifecycle_status: EventLifeCycleStatus,
    pub team_home: String,
    pub team_away: String,
    pub score_home: u16,
    pub score_away: u16,
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub enum EventStatus {
    Active,
    InActive,
}

impl Default for EventStatus {
    fn default() -> Self {
        EventStatus::InActive
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub enum EventLifeCycleStatus {
    NotStarted,
    Started,
    Completed,
}

impl Default for EventLifeCycleStatus {
    fn default() -> Self {
        EventLifeCycleStatus::NotStarted
    }
}
