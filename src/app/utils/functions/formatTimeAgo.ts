const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const inputDate = new Date(dateString);

  // Handle invalid dates
  if (isNaN(inputDate.getTime())) {
    return "Invalid date";
  }

  const diffInMs = now.getTime() - inputDate.getTime();

  // Handle future dates
  if (diffInMs < 0) {
    return "Just now";
  }

  const seconds = Math.floor(diffInMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  // Years
  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  }

  // Months
  if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  // Weeks
  if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  // Days
  if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  // Hours
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  // Minutes
  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  }

  // Seconds
  if (seconds > 0) {
    return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
  }

  // Just now
  return "Just now";
};

export default formatTimeAgo;
