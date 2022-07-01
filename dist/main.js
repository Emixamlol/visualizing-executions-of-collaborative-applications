/* const statuses = {
  notStarted: 0,
  inProgress: 1,
  done: 2,
};

console.log(statuses.inProgress);
 */
var StatusEnum;
(function (StatusEnum) {
    StatusEnum["NotStarted"] = "notStarted";
    StatusEnum["InProgress"] = "inProgress";
    StatusEnum["Done"] = "done";
})(StatusEnum || (StatusEnum = {}));
console.log(StatusEnum.InProgress);
let notStartedStatus = StatusEnum.NotStarted;
console.log(notStartedStatus);
notStartedStatus = StatusEnum.Done;
console.log(notStartedStatus);
