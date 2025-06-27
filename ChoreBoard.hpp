#ifndef CHOREBOARD_HPP
#define CHOREBOARD_HPP

#include <vector>
#include <string>
#include <fstream>
#include <sstream>

using namespace std;

// Structs for data storage
struct User {
    string name;
    string email;
    string password;
    bool isAdmin;
};

struct Chore {
    string name;
    string description;
    string dueDate;
    string assignedUser;
    string status; // "Pending" or "Completed"
};

struct Expense {
    double amount;
    string description;
    string category;
};

class ChoreBoard {
private:
    vector<User> users;
    vector<Chore> chores;
    vector<Expense> expenses;
    User* currentUser = nullptr;

    // File paths
    const string usersFile = "data/users.txt";
    const string choresFile = "data/chores.txt";
    const string expensesFile = "data/expenses.txt";

    // Helper function for safe input
    string getInput(const string& prompt);

    // Load data from files
    void loadUsers();
    void loadChores();
    void loadExpenses();

    // Save data to files
    void saveUsers();
    void saveChores();
    void saveExpenses();

    // Validate email uniqueness
    bool isEmailUnique(const string& email);

public:
    ChoreBoard();
    void registerUser();
    bool login();
    void createChore();
    void viewChores();
    void completeChore();
    void logExpense();
    void viewExpenses();
};

#endif // CHOREBOARD_HPP