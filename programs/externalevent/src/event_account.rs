use anchor_lang::prelude::*;

#[account]
#[derive(Default)]
pub struct ExternalEvent {
    pub authority: Pubkey,
    pub reference: String,
    pub name: String,
    pub start_expected_timestamp: i64,
    pub start_actual_timestamp: i64,
    pub end_actual_timestamp: i64,
    pub status: EventStatus,
    pub lifecycle_status: EventLifeCycle,
    pub current_period: EventPeriod,
    pub team_home: String,
    pub team_away: String,
    pub score_home: u16,
    pub score_away: u16,
}

#[account]
#[derive(Default)]
pub struct ExternalEventUpdate {
    pub external_event: String,
    pub lifecycle_status: EventPeriod,
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
pub enum EventLifeCycle {
    Unknown,
    Upcoming,
    Started,
    Completed,
}

impl Default for EventLifeCycle {
    fn default() -> Self {
        EventLifeCycle::Unknown
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Debug, Clone, PartialEq)]
pub enum EventPeriod {
    Unknown,
    PreEvent,
    FirstHalf,
    SecondHalf,
    FullTime,
    PostEvent,
}

impl Default for EventPeriod {
    fn default() -> Self {
        EventPeriod::Unknown
    }
}


