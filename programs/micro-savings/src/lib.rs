use anchor_lang::prelude::*;

declare_id!("AXP5XUGdGcAYpmxzmJr54vrvdvgbsohGDNA3hUJ3oC3B");

#[program]
pub mod micro_savings {
    use super::*;

    pub fn initialize_account(ctx: Context<InitializeAccount>) -> Result<()> {
        let s = &mut ctx.accounts.savings;
        s.user = ctx.accounts.user.key();
        s.balance = 0;
        Ok(())
    }

    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        let s = &mut ctx.accounts.savings;
        s.balance += amount;
        Ok(())
    }

    pub fn withdraw(ctx: Context<Withdraw>, amount: u64) -> Result<()> {
        let s = &mut ctx.accounts.savings;
        require!(s.balance >= amount, ErrorCode::InsufficientFunds);
        s.balance -= amount;
        Ok(())
    }

    pub fn create_goal(ctx: Context<CreateGoal>, amount: u64, description: String) -> Result<()> {
        let g = &mut ctx.accounts.goal;
        g.user = ctx.accounts.user.key();
        g.amount = amount;
        g.saved = 0;
        g.description = description;
        Ok(())
    }

    pub fn deposit_to_goal(ctx: Context<DepositToGoal>, amount: u64) -> Result<()> {
        let g = &mut ctx.accounts.goal;
        require!(g.user == ctx.accounts.user.key(), ErrorCode::Unauthorized);
        g.saved += amount;
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

#[derive(Accounts)]
pub struct CreateGoal<'info> {
    #[account(init, payer = user, space = 8 + 32 + 8 + 8 + 4 + 256)]
    pub goal: Account<'info, Goal>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct DepositToGoal<'info> {
    #[account(mut, has_one = user)]
    pub goal: Account<'info, Goal>,
    pub user: Signer<'info>,
}

#[account]
pub struct Savings {
    pub user: Pubkey,
    pub balance: u64,
}

#[account]
pub struct Goal {
    pub user: Pubkey,
    pub amount: u64,
    pub saved: u64,
    pub description: String,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient funds")]
    InsufficientFunds,
    #[msg("Unauthorized")]
    Unauthorized,
}
