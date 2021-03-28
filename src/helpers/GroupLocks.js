const groupLock = (treeGridData, userId) => {
  let groupLock = [];
  for (const { columLocks } of treeGridData) {
    for (const lock of columLocks) {
      if (lock.treeUser !== userId) {
        groupLock = [...columLocks, ...groupLock];
      }
    }
  }
  return groupLock;
};

export { groupLock };
