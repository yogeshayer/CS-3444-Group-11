#include "ChoreBoard.hpp"
#include <iostream>

using namespace std;

ChoreBoard::ChoreBoard() {
    loadUsers();
    loadChores();
    loadExpenses();
}

string ChoreBoard::getInput(const string& prompt) {
    string input;
    cout << prompt;
    getline(cin, input);
    return input;
}

void ChoreBoard::loadUsers() {
    ifstream file(usersFile);
    if (!file.is_open()) return;
    string line;
    while (getline(file, line)) {
        stringstream ss(line);
        string name, email, password, isAdminStr;
        getline(ss, name, ',');
        getline(ss, email, ',');
        getline(ss, password, ',');
        getline(ss, isAdminStr, ',');
        users.push_back({name, email, password, isAdminStr == "1"});
    }
    file.close();
}

void ChoreBoard::loadChores() {
    ifstream file(choresFile);
    if (!file.is_open()) return;
    string line;
    while (getline(file, line)) {
        stringstream ss(line);
        string name, desc, date, user, status;
        getline(ss, name, ',');
        getline(ss, desc, ',');
        getline(ss, date, ',');
        getline(ss, user, ',');
        getline(ss, status, ',');
        chores.push_back({name, desc, date, user, status});
    }
    file.close();
}

void ChoreBoard::loadExpenses() {
    ifstream file(expensesFile);
    if (!file.is_open()) return;
    string line;
    while (getline(file, line)) {
        stringstream ss(line);
        string amountStr, desc, cat;
        getline(ss, amountStr, ',');
        getline(ss, desc, ',');
        getline(ss, cat, ',');
        try {
            expenses.push_back({stod(amountStr), desc, cat});
        } catch (...) {
            continue; // Skip invalid entries
        }
    }
    file.close();
}

void ChoreBoard::saveUsers() {
    ofstream file(usersFile);
    for (const auto& user : users) {
        file << user.name << "," << user.email << "," << user.password << ","
             << (user.isAdmin ? "1" : "0") << "\n";
    }
    file.close();
}

void ChoreBoard::saveChores() {
    ofstream file(choresFile);
    for (const auto& chore : chores) {
        file << chore.name << "," << chore.description << "," << chore.dueDate << ","
             << chore.assignedUser << "," << chore.status << "\n";
    }
    file.close();
}

void ChoreBoard::saveExpenses() {
    ofstream file(expensesFile);
    for (const auto& expense : expenses) {
        file << expense.amount << "," << expense.description << "," << expense.category << "\n";
    }
    file.close();
}

bool ChoreBoard::isEmailUnique(const string& email) {
    for (const auto& user : users) {
        if (user.email == email) return false;
    }
    return true;
}

void ChoreBoard::registerUser() {
    User user;
    user.name = getInput("Enter name: ");
    user.email = getInput("Enter email: ");
    if (!isEmailUnique(user.email)) {
        cout << "Email already exists.\n";
        return;
    }
    user.password = getInput("Enter password: ");
    string isAdminStr = getInput("Is admin? (1 for yes, 0 for no): ");
    user.isAdmin = (isAdminStr == "1");

    users.push_back(user);
    saveUsers();
    cout << "Registration successful!\n";
}

bool ChoreBoard::login() {
    string email = getInput("Enter email: ");
    string password = getInput("Enter password: ");

    for (auto& user : users) {
        if (user.email == email && user.password == password) {
            currentUser = &user;
            cout << "Login successful! Welcome, " << user.name << "\n";
            return true;
        }
    }
    cout << "Invalid credentials.\n";
    return false;
}

void ChoreBoard::createChore() {
    if (!currentUser || !currentUser->isAdmin) {
        cout << "Only Admin Roommates can create chores.\n";
        return;
    }
    Chore chore;
    chore.name = getInput("Enter chore name: ");
    chore.description = getInput("Enter description: ");
    chore.dueDate = getInput("Enter due date (e.g., YYYY-MM-DD): ");
    chore.assignedUser = getInput("Enter assigned user email: ");
    chore.status = "Pending";

    chores.push_back(chore);
    saveChores();
    cout << "Chore created successfully!\n";
}

void ChoreBoard::viewChores() {
    if (!currentUser) {
        cout << "Please log in.\n";
        return;
    }
    cout << "\nChore List:\n";
    for (const auto& chore : chores) {
        if (chore.assignedUser == currentUser->email || currentUser->isAdmin) {
            cout << "Name: " << chore.name << ", Desc: " << chore.description
                 << ", Due: " << chore.dueDate << ", Assigned: " << chore.assignedUser
                 << ", Status: " << chore.status << "\n";
        }
    }
}

void ChoreBoard::completeChore() {
    if (!currentUser) {
        cout << "Please log in.\n";
        return;
    }
    string choreName = getInput("Enter chore name to mark as completed: ");
    for (auto& chore : chores) {
        if (chore.name == choreName && chore.assignedUser == currentUser->email) {
            chore.status = "Completed";
            saveChores();
            cout << "Chore marked as completed!\n";
            return;
        }
    }
    cout << "Chore not found or not assigned to you.\n";
}

void ChoreBoard::logExpense() {
    if (!currentUser) {
        cout << "Please log in.\n";
        return;
    }
    Expense expense;
    string amountStr = getInput("Enter amount: ");
    try {
        expense.amount = stod(amountStr);
        if (expense.amount <= 0) throw invalid_argument("Amount must be positive.");
    } catch (...) {
        cout << "Invalid amount.\n";
        return;
    }
    expense.description = getInput("Enter description: ");
    expense.category = getInput("Enter category (e.g., Utilities, Groceries): ");

    expenses.push_back(expense);
    saveExpenses();
    cout << "Expense logged successfully!\n";
}

void ChoreBoard::viewExpenses() {
    if (!currentUser) {
        cout << "Please log in.\n";
        return;
    }
    cout << "\nExpense List:\n";
    for (const auto& expense : expenses) {
        cout << "Amount: $" << expense.amount << ", Desc: " << expense.description
             << ", Category: " << expense.category << "\n";
    }
}