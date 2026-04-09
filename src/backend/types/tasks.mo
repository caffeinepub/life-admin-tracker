import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;

  public type TaskCategory = {
    #Bills;
    #Documents;
    #Insurance;
    #Healthcare;
    #Other;
  };

  public type TaskStatus = {
    #Pending;
    #Completed;
  };

  public type Task = {
    id : Nat;
    userId : UserId;
    title : Text;
    description : Text;
    dueDate : Int;
    category : TaskCategory;
    status : TaskStatus;
    createdAt : Timestamp;
  };
};
