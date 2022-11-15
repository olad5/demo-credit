Feature: Wallet to Wallet Transfer

Scenario: Transfer to another User Wallet
  Given I provide a valid amount and a valid recipient userId
  When I attempt to transfer funds to another user's wallet
  Then the transfer of funds should be successfully with a success status
   
Scenario: Transfer to another User Wallet balance sheet is correct
  Given I provide a valid amount and a valid recipient userId
  When I attempt to transfer funds to another user's wallet
  Then the sum of the difference in the debit wallet and the difference in the credit wallet should equal 0

Scenario: Transfer to Self
  Given I provide a valid amount and my userId as the recipient userId
  When I attempt to transfer funds to my wallet
  Then the process fails and wallet is not debited nor credited

Scenario: Insufficient Funds
  Given I provide a valid recipient userId and an amount greater than my current wallet balance
  When I attempt to transfer funds to another user's wallet
  Then the process fails and I get an Insufficient funds error message

