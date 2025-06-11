use anchor_lang::prelude::*;

declare_id!("AXP5XUGdGcAYpmxzmJr54vrvdvgbsohGDNA3hUJ3oC3B");

#[program]
pub mod micro_savings {
    use super::*;
    pub fn initialize_account(ctx: Context<InitializeAccount>) -> Result<()> {
        let savings = &mut ctx.accounts.savings;
        savings.user = ctx.accounts.user.key();
        savings.balance = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let savings = &mut ctx.accounts.savings;
        savings.balance += amount;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let savings = &mut ctx.accounts.savings;
        require!(savings.balance >= amount, ErrorCode::InsufficientFunds);
        savings.balance -= amount;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeAccount<'info> {
    #[account(init, payer = user, space = 8 + 32 + 8)]
    pub savings: Account<'info, Savings>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct Deposit<'info> {
    #[account(mut, has_one = user)]
    pub savings: Account<'info, Savings>,
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct Withdraw<'info> {
    #[account(mut, has_one = user)]
    pub savings: Account<'info, Savings>,
    pub user: Signer<'info>,
}

#[account]
pub struct Savings {
    pub user: Pubkey,
    pub balance: u64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Not enough funds to withdraw")]
    InsufficientFunds,
}