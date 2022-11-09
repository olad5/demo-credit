Feature: Create user

Scenario: Creating a user
  Given I provide valid user details
  When I attempt to create a user
  Then the user should be saved successfully 

Scenario: Invalid password
  Given I provide an invalid password
  When I attempt to create a user
  Then I should get an invalid details error

Scenario: Invalid email
  Given I provide an invalid email
  When I attempt to create a user
  Then I should get an invalid details error

Scenario: Email exists
  Given I provide an valid email
  When I attempt to create a user that already exists
  Then I should get an accounts already exits error
