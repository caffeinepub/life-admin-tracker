import Types "../types/tasks";
import List "mo:core/List";
import Array "mo:core/Array";
import Int "mo:core/Int";

module {
  public type Task = Types.Task;
  public type TaskCategory = Types.TaskCategory;
  public type TaskStatus = Types.TaskStatus;

  public func create(
    tasks : List.List<Task>,
    nextId : Nat,
    userId : Principal,
    title : Text,
    description : Text,
    dueDate : Int,
    category : TaskCategory,
    createdAt : Int,
  ) : Task {
    let task : Task = {
      id = nextId;
      userId;
      title;
      description;
      dueDate;
      category;
      status = #Pending;
      createdAt;
    };
    tasks.add(task);
    task;
  };

  public func update(
    tasks : List.List<Task>,
    id : Nat,
    caller : Principal,
    title : Text,
    description : Text,
    dueDate : Int,
    category : TaskCategory,
  ) : Bool {
    switch (tasks.findIndex(func(t : Task) : Bool { t.id == id and t.userId == caller })) {
      case null { false };
      case (?idx) {
        let existing = tasks.at(idx);
        tasks.put(idx, { existing with title; description; dueDate; category });
        true;
      };
    };
  };

  public func toggleStatus(
    tasks : List.List<Task>,
    id : Nat,
    caller : Principal,
  ) : Bool {
    switch (tasks.findIndex(func(t : Task) : Bool { t.id == id and t.userId == caller })) {
      case null { false };
      case (?idx) {
        let existing = tasks.at(idx);
        let newStatus : TaskStatus = switch (existing.status) {
          case (#Pending) { #Completed };
          case (#Completed) { #Pending };
        };
        tasks.put(idx, { existing with status = newStatus });
        true;
      };
    };
  };

  public func delete(
    tasks : List.List<Task>,
    id : Nat,
    caller : Principal,
  ) : Bool {
    switch (tasks.findIndex(func(t : Task) : Bool { t.id == id and t.userId == caller })) {
      case null { false };
      case (?idx) {
        // Shift elements left to remove the item at idx
        let size = tasks.size();
        var i = idx;
        while (i + 1 < size) {
          tasks.put(i, tasks.at(i + 1));
          i += 1;
        };
        ignore tasks.removeLast();
        true;
      };
    };
  };

  public func getByUser(
    tasks : List.List<Task>,
    userId : Principal,
  ) : [Task] {
    tasks.filter(func(t : Task) : Bool { t.userId == userId }).toArray();
  };

  public func getUpcoming(
    tasks : List.List<Task>,
    userId : Principal,
    now : Int,
  ) : [Task] {
    let horizon : Int = now + 30 * 24 * 60 * 60 * 1_000_000_000; // 30 days in nanoseconds
    let filtered = tasks.filter(func(t : Task) : Bool {
      t.userId == userId and t.status == #Pending and t.dueDate <= horizon
    }).toArray();
    filtered.sort<Task>(func(a, b) { Int.compare(a.dueDate, b.dueDate) });
  };
};
