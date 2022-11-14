Feature: Initialize User Wallet Funding

Scenario: Initializing a user Wallet Funding
  Given I provide a valid amount
  When I attempt to initialize a funding process for a user's wallet
  Then the wallet funding should be successfully with a pending status
   
Scenario: Payment Service Error
  Given I provide a valid userId
  When I attempt to create a user wallet but the payment Service fails
  Then the wallet transaction should happen and I should get a payment service error
