export const getDiffDay = (endingDate: string) => {
  const today = new Date();
  const masTime = new Date(endingDate);
  const diff = masTime.getTime() - today.getTime();
  if (diff <= 0) return 0;
  else {
    const diffDay = Math.floor(diff / (1000 * 60 * 60 * 24));
    return diffDay;
  }
};
