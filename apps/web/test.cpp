#include <iostream>
using namespace std;

int test() { return 4; }

int main(int argc, char *argv[]) {
  cout << "Hello" << "\n";
  int x;
  cin >> x;
  cout << test() << "\n";
  return 0;
}
