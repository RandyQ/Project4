# Project4

This is project 4 for COP3813 (serverside programming).
https://project-4-randyq.herokuapp.com/ is the deployed app address

To gain admin functionality (the ability to delete any record) log in as: 
"email": 'admin',
"password": 'admin'
(for grading purposes)

Otherwise, just register as a new user and log in!  
Or you can also just use:
"email": 'Adam@gmail.com',
"password": 'adam'

credentials.js are included to ensure app works appropriately when grading

Note*:  All text fields and edit and delete buttons have tooltips added to aid in understanding its purpose.
        Also, validation is included in every page with forms.  ALL information must be included when filling 
        forms out.

Description
The following is a guide discussing the project's features and use.  It is hoped that the UI is straightforward enough for any user to understand how to use it, but just in case (and for ease of grading):

- First go to the home route (or any route for that matter), which will redirect you to a login page if not 
  already signed in.  Home route = https://project-4-randyq.herokuapp.com/ or localhost:3000.
- Either register a new account (by clicking the link 'Register an Account') or sign in with the above
  credentials to access the system.
- Once logged in, you will be at the home screen where you can choose to 'View all Entries' (see weight loss 
  records for all users), 'Add a new Entry' (create a new weight loss record with your name and date as default), or click 'WeighTracker Functions' (which brings you to a page to calculate weight loss over a chosen timespan or calculate BMI).  
  There is also a 'Logout' link available on the homescreen if you wish to logout (discards your session and brings
  you back to the login page).
    - 'View all Entries' Page:
       Here you have the ability to edit or delete records.  IF you are an ADMIN you can delete ANY record.  However, 
       if not, you may only delete a record with your name (authorization).  Small icons (fontawesome) are located
       just to the right of the date for all entries signifying edit or delete.
         - When choosing edit, the 'Add new Entry' page will pop up with pre-filled fields with the entry's data
           that you chose to edit.  Make any changes you like and press the 'Save' button.
         - When choosing delete, an alert (or choose) will pop up asking if you are sure.  Click 'Ok' to confirm.
    - 'Add a new Entry' page:
       Here a form will pop up (same as the edit form) with pre-filled fields for name and date.  Change them if you like,
       they are added only for convenience.  The rest of the fields will be blank.  Add all information and click 'Save'.
    - 'WeighTracker Functions' page:
       Here you can calculate total weight loss (or gain) for any user for a week, a month, or since their first record.
       There is also a second function just below the above function to calculate the BMI of a chosen user.
         - Weight loss function:
           Choose a user name in the dropdown, then choose the time span you wish to calculate (IE week, month, since start).
           Press 'Calculate' and the results will show up in a flash message at the bottom of the page.
         - BMI function:
           Choose a user name in the dropdown, then click 'Calculate' (this finds the most recent record stored and calculates
           BMI from that).      

Weight Tracker Application
1) Add, edit, and delete weight, height, date, and names of people losing weight.
2) Function to calculate total weight loss over a week, month or more using the weight entries from above.
   Function to calculate BMI from most recent record.
3) Added authentication through a login to access the app.
   Authorization for deleting a record.
   Log out.
