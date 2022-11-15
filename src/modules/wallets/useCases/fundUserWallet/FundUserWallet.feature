Feature: Funding A User's Wallet

Scenario: Add Funds to User's Wallet
  Given I provide a valid wallet Transaction that has the reference of the initialized wallet funding transaction
  When I attempt to update the user's wallet with the added funds
  Then the update of the user's wallet should be successfully
   
Scenario: Funding from payment service failed
  Given I provide a reference of the initialized wallet funding transaction
  When I attempt to update the user's wallet with the added funds, the payment service response with a failed status
  Then the update of the user's wallet should be not happen
