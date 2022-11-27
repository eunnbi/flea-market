export const getDiffDay = (endingDate: Date) => {
  const today = new Date();
  const diff = endingDate.getTime() - today.getTime();
  if (diff <= 0) return 0;
  else {
    const diffDay = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return diffDay;
  }
};
