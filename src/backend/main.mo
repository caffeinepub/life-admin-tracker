import Types "types/tasks";
import Common "types/common";
import TasksMixin "mixins/tasks-api";
import List "mo:core/List";

actor {
  let tasks = List.empty<Types.Task>();
  let counter : Common.Counter = { var value = 0 };

  include TasksMixin(tasks, counter);
};
