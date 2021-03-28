const groupLock = (treeGridData, userId, notUserBlockCell = true) => {
  let groupLock = [];

  if (notUserBlockCell) {
    for (const { columLocks } of treeGridData) {
      for (const lock of columLocks) {
        if (lock.treeUser !== userId) {
          groupLock = [...columLocks, ...groupLock];
        }
      }
    }
  } else
    groupLock = treeGridData
      .flatMap((data) => data.columLocks)
      .filter((data) => data.treeUser === userId);

  return groupLock;
};

export { groupLock };
