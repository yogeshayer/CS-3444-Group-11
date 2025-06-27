#include "ChoreBoard.hpp"
#include <iostream>

using namespace std;

int main() {
    ChoreBoard app; 
    string choice;

    while (true) {
        cout << "\nChoreBoard Menu:\n"
             << "1. Register\n"
             << "2. Login\n"
             << "3. Create Chore\n"
             << "4. View Chores\n"
             << "5. Complete Chore\n"
             << "6. Log Expense\n"
             << "7. View Expenses\n"
             << "8. Exit\n"
             << "Enter choice: ";
        getline(cin, choice);

        if (choice == "1") app.registerUser();
        else if (choice == "2") app.login();
        else if (choice == "3") app.createChore();
        else if (choice == "4") app.viewChores();
        else if (choice == "5") app.completeChore();
        else if (choice == "6") app.logExpense();
        else if (choice == "7") app.viewExpenses();
        else if (choice == "8") break;
        else cout << "Invalid choice.\n";
    }
    return 0;
}