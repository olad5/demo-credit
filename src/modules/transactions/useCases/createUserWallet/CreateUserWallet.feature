Feature: Create User Wallet

Scenario: Creating a user Wallet
  Given I provide a valid userId
  When I attempt to create a user wallet
  Then the user wallet should be saved successfully
   
Scenario: Creating a user Wallet with starting balance of 0
  Given I provide a valid userId
  When I attempt to create a user wallet
  Then the user wallet should be saved successfully with a balance of 0

Scenario: Wallet already exists
  Given I provide an valid userId
  When I attempt to create a wallet for a user that already has a wallet
  Then I should get a user wallet already exists error
