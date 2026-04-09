import Types "../types/tasks";
import Common "../types/common";
import TaskLib "../lib/tasks";
import List "mo:core/List";
import Time "mo:core/Time";

mixin (tasks : List.List<Types.Task>, counter : Common.Counter) {
  public shared ({ caller }) func createTask(
    title : Text,
    description : Text,
    dueDate : Int,
    category : Types.TaskCategory,
  ) : async Nat {
    let id = counter.value;
    counter.value += 1;
    let task = TaskLib.create(tasks, id, caller, title, description, dueDate, category, Time.now());
    task.id;
  };

  public shared ({ caller }) func updateTask(
    id : Nat,
    title : Text,
    description : Text,
    dueDate : Int,
    category : Types.TaskCategory,
  ) : async Bool {
    TaskLib.update(tasks, id, caller, title, description, dueDate, category);
  };

  public shared ({ caller }) func toggleTaskStatus(id : Nat) : async Bool {
    TaskLib.toggleStatus(tasks, id, caller);
  };

  public shared ({ caller }) func deleteTask(id : Nat) : async Bool {
    TaskLib.delete(tasks, id, caller);
  };

  public shared query ({ caller }) func getMyTasks() : async [Types.Task] {
    TaskLib.getByUser(tasks, caller);
  };

  public shared query ({ caller }) func getMyUpcomingTasks() : async [Types.Task] {
    TaskLib.getUpcoming(tasks, caller, Time.now());
  };
};
