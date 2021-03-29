const groupLock = (treeGridData, userId, notUserBlockCell = true) => {
  let groupLock = [];

  if (notUserBlockCell) {
    groupLock = treeGridData
      .flatMap((data) => data.columLocks)
      .filter((data) => data.treeUser !== userId);
  } else
    groupLock = treeGridData
      .flatMap((data) => data.columLocks)
      .filter((data) => data.treeUser === userId);

  return groupLock;
};

export { groupLock };
